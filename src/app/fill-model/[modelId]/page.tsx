'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './fill-model.module.css';
import { modelsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CatalogueFormSection } from '@/components/CatalogueFormSection';
import { FormValues } from '@/lib/types';

export default function FillModelPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const [dataModel, setDataModel] = useState<any>(null);
  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const methods = useForm<FormValues>({
    defaultValues: {
      catalogue: {
        title: '',
        description: '',
        language: '',
        modifiedDate: '',
        homepage: '',
        owner: '',
        datasets: [],
        dataservices: [],
      },
    },
  });

  useEffect(() => {
    async function fetchModel() {
      if (modelId) {
        try {
          const model = await modelsAPI.getById(modelId);
          setDataModel(model);
        } catch (error) {
          console.error('Failed to fetch data model:', error);
          setPopup({ message: 'Falha ao carregar o modelo de dados.', type: 'error' });
        }
      }
    }
    fetchModel();
  }, [modelId]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('Form data:', data);


    const modifiedData = {
      ...data,
      catalogue: {
        ...data.catalogue,
        title: `Catálogo - ${data.catalogue.title}`,
        datasets: data.catalogue.datasets.map(dataset => ({
          ...dataset,
          title: `Dataset - ${dataset.title}`,
          simple_title: dataset.title
        })),
        dataservices: data.catalogue.dataservices.map(dataservice => ({
          ...dataservice,
          title: `DataService - ${dataservice.title}`,
          simple_title: dataservice.title
        })),
      },
    };


    try {
      const response = await modelsAPI.createDataClass(modelId, {
        label: modifiedData.catalogue.title,
        description: modifiedData.catalogue.description,
        minMultiplicity: 1,
        maxMultiplicity: 1,
      });

      const dataClassId = response.id; // Store the ID of the created data class

     // Fetch available data types for the model
      const dataTypes = await modelsAPI.getDataTypesFromModel(modelId);

      // Find the correct data type for each field and create data elements
      const stringDataType = dataTypes.items.find(dt => dt.label === 'String');
      if (stringDataType) {
        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Idioma',
          maxMultiplicity: '-1',
          minMultiplicity: '1',
          dataType: stringDataType.id,
          description: modifiedData.catalogue.language,
        });

        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Título',
          maxMultiplicity: '1',
          minMultiplicity: '1',
          dataType: stringDataType.id,
          description: data.catalogue.title
        });
      }

      const DateDataType = dataTypes.items.find(dt => dt.label === 'Date');
      if (DateDataType) {
        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Modificado',
          maxMultiplicity: '1',
          minMultiplicity: '1',
          dataType: DateDataType.id,
          description: modifiedData.catalogue.modifiedDate,
        });
      }

      const textDataType = dataTypes.items.find(dt => dt.label === 'Text');
      if (textDataType) {
        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Homepage',
          maxMultiplicity: '1',
          minMultiplicity: '1',
          dataType: textDataType.id,
          description: modifiedData.catalogue.homepage
        });
        
        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Descrição',
          maxMultiplicity: '1',
          minMultiplicity: '1',
          dataType: textDataType.id,
          description: data.catalogue.description
        });


      }

      // Create child data classes for datasets
      const accessDataType = dataTypes.items.find(dt => dt.label === 'Níveis_Acesso');
      const categoryDataType = dataTypes.items.find(dt => dt.label === 'Categoria');
      const decimalDataType = dataTypes.items.find(dt => dt.label === 'Decimal');

      if (modifiedData.catalogue.datasets) {
        for (const dataset of modifiedData.catalogue.datasets) {
          //console.log("Creating dataset with title:", dataset.title);
          const datasetIteration = await modelsAPI.createChildDataClass(modelId, dataClassId, {
            label: dataset.title,
            description: dataset.description,
            minMultiplicity: 1,
            maxMultiplicity: -1,
          });

          // Add data elements to the dataset's data class
          if (stringDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Título',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: stringDataType.id,
              description: dataset.simple_title,
            });
          }

          if (textDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Descrição',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: textDataType.id,
              description: dataset.description,
            });
          }

          if (DateDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Modificado',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: DateDataType.id,
              description: dataset.modified_date,
            });
          }

          
          if (accessDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Acesso',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: accessDataType.id,
              description: dataset.access
            });
          }
         
          if (decimalDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Versão',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: decimalDataType.id,
              description: dataset.version
            });
          }
          
          if (categoryDataType) {
            await modelsAPI.createDataElement(modelId, datasetIteration.id, {
              label: 'Categoria',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: categoryDataType.id,
              description: dataset.category
            });
          }
          //ChildDataClasses
          if (dataset.distributions) {
            for (const distribution of dataset.distributions) {
              //console.log("Creating dataset with title:", dataset.title);
              const distributionIteration = await modelsAPI.createChildDataClass(modelId, datasetIteration.id, {
                label: `Distribution - ${dataset.simple_title}.${distribution.format}`,
                description: `Distribuição do dataset ${dataset.simple_title} em formato ${distribution.format}`,
                minMultiplicity: 1,
                maxMultiplicity: -1,
              });
              //elementos da distribuição
              if (stringDataType) {
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'Formato',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: stringDataType.id,
                  description: distribution.format,
                });
              }
              if (textDataType) {
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'URL de Acesso',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: textDataType.id,
                  description: distribution.accessURL,
                });
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'URL de Download',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: textDataType.id,
                  description: distribution.downloadURL,
                });
              }
              if (DateDataType) {
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'Modificado',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: DateDataType.id,
                  description: distribution.modified,
                });
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'Criado',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: DateDataType.id,
                  description: distribution.created,
                });
              }
              const licenseDataType = dataTypes.items.find(dt => dt.label === 'Licença');
              if (licenseDataType) {
                await modelsAPI.createDataElement(modelId, distributionIteration.id, {
                  label: 'Licença',
                  maxMultiplicity: '1',
                  minMultiplicity: '1',
                  dataType: licenseDataType.id,
                  description: distribution.license,
                });
              }


            }
          }
          const schemaIteration = await modelsAPI.createChildDataClass(modelId, datasetIteration.id, {
            label: `Schema - ${dataset.simple_title}`,
            description: '',
            minMultiplicity: 1,
            maxMultiplicity: -1,
          });
          //Agente
        }
      }

      
      if (modifiedData.catalogue.dataservices) {
        for (const dataservice of modifiedData.catalogue.dataservices) {
          //console.log("Creating dataservice with title:", dataservice.title);
          const dataserviceIteration =await modelsAPI.createChildDataClass(modelId, dataClassId, {
            label: dataservice.title,
            description: dataservice.description,
            minMultiplicity: 1,
            maxMultiplicity: -1,
          });
          //Titulo
          if (stringDataType) {
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Título',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: stringDataType.id,
              description: dataservice.simple_title
            });
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Formato',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: stringDataType.id,
              description: dataservice.format
            });

          }
          //Descricao
          if (textDataType) {
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Descrição',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: textDataType.id,
              description: dataservice.description
            });

          //URL_Download
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Endpoint',
              maxMultiplicity: '-1',
              minMultiplicity: '1',
              dataType: textDataType.id,
              description: dataservice.endpoint_url
            });

          }
          
          
          //Licenca
          const licenseDataType = dataTypes.items.find(dt => dt.label === 'Licença');
          if (licenseDataType) {
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Licença',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: licenseDataType.id,
              description: dataservice.license
            });
          }

          //Acesso
          if (accessDataType) {
            await modelsAPI.createDataElement(modelId, dataserviceIteration.id, {
              label: 'Acesso',
              maxMultiplicity: '1',
              minMultiplicity: '1',
              dataType: accessDataType.id,
              description: dataservice.access
            });
          }
        
        //ChildDataClasses:
        //Agente
        //RecursoLegal
        
        
        }
      }

    setPopup({ message: 'Catálogo submetido com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Failed to create data class:', error);
      
    setPopup({ message: 'Falha ao submeter o catálogo.', type: 'error' });
    }
  };

  const handleGoBack = () => {
    router.push('/menu');
  };

  if (!dataModel) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <button onClick={handleGoBack} className={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>Preencher Modelo: {dataModel.label}</h1>
          <p className={styles.subtitle}>Adicione um catálogo ao seu modelo de dados.</p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
            <CatalogueFormSection />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Submeter Catálogo
              </button>
            </div>
          </form>
        </FormProvider>

        {popup && (
          <div className={styles.popupOverlay}>
            <div className={`${styles.popup} ${styles[popup.type]}`}>
              <p>{popup.message}</p>
              <button onClick={handleGoBack}>Ir para o Menu</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

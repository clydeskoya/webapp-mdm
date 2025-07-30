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
    const modifiedData = {
      ...data,
      catalogue: {
        ...data.catalogue,
        title: `Catálogo - ${data.catalogue.title}`,
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
      console.log(dataTypes);

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
          description: modifiedData.catalogue.title
        });
      }

      const modifiedDateDataType = dataTypes.items.find(dt => dt.label === 'Date');
      if (modifiedDateDataType) {
        await modelsAPI.createDataElement(modelId, dataClassId, {
          label: 'Modificado',
          maxMultiplicity: '1',
          minMultiplicity: '1',
          dataType: modifiedDateDataType.id,
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

      const titleDataType = dataTypes.items.find(dt => dt.label === 'String');
      if (titleDataType) {

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

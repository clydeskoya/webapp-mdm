'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './edit-catalogue.module.css';
import { modelsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CatalogueFormSection } from '@/components/CatalogueFormSection';
import { FormValues } from '@/lib/types';

export default function EditCataloguePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const modelId = params.modelId as string;
  const catalogueId = params.catalogueId as string;
  const [dataModel, setDataModel] = useState<any>(null);
  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [accessLevels, setAccessLevels] = useState<any[]>([]);

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

    async function fetchCategories() {
      if (modelId) {
        try {
          const dataTypes = await modelsAPI.getDataTypesFromModel(modelId);
          const categoryDataType = dataTypes.items.find((dt: any) => dt.label === 'Categoria');
          if (categoryDataType && categoryDataType.enumerationValues) {
            setCategories(categoryDataType.enumerationValues);
          } else {
            console.log('Category data type not found or has no enumerationValues.');
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      }
    }
    fetchCategories();

    async function fetchAccessLevels() {
      if (modelId) {
        try {
          const dataTypes = await modelsAPI.getDataTypesFromModel(modelId);
          const accessDataType = dataTypes.items.find((dt: any) => dt.label === 'Níveis_Acesso');
          if (accessDataType) {
            setAccessLevels(accessDataType.enumerationValues);
          }
        } catch (error) {
          console.error('Failed to fetch access levels:', error);
        }
      }
    }
    fetchAccessLevels();
  }, [modelId]);

  useEffect(() => {
    async function fetchCatalogueData() {
      if (modelId && catalogueId) {
        try {
          const catalogue = await modelsAPI.getDataClassById(modelId, catalogueId);
          const childDataClasses = await modelsAPI.listChildDataClasses(modelId, catalogueId);

          const datasets = childDataClasses.items.filter((item: any) => item.label.startsWith('Dataset'));
          const dataservices = childDataClasses.items.filter((item: any) => item.label.startsWith('DataService'));

          methods.reset({
            catalogue: {
              ...catalogue,
              title: catalogue.label.replace('Catálogo - ', ''),
              datasets: datasets.map((d: any) => ({ ...d, title: d.label.replace('Dataset - ', '')})),
              dataservices: dataservices.map((d: any) => ({ ...d, title: d.label.replace('DataService - ', '')})),
            },
          });
        } catch (error) {
          console.error('Failed to fetch catalogue data:', error);
        }
      }
    }
    fetchCatalogueData();
  }, [modelId, catalogueId, methods]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await modelsAPI.updateDataElement(modelId, catalogueId, data.catalogue.id, {
        label: `Catálogo - ${data.catalogue.title}`,
        description: data.catalogue.description,
      });

      for (const dataset of data.catalogue.datasets) {
        await modelsAPI.updateDataElement(modelId, catalogueId, dataset.id, {
          label: `Dataset - ${dataset.title}`,
          description: dataset.description,
        });
      }

      for (const dataservice of data.catalogue.dataservices) {
        await modelsAPI.updateDataElement(modelId, catalogueId, dataservice.id, {
          label: `DataService - ${dataservice.title}`,
          description: dataservice.description,
        });
      }

      setPopup({ message: 'Catálogo atualizado com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Failed to update catalogue:', error);
      setPopup({ message: 'Falha ao atualizar o catálogo.', type: 'error' });
    }
  };

  const handleGoBack = () => {
    router.push(`/fill-model/${modelId}`);
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
          <h1 className={styles.title}>Editar Catálogo: {dataModel.label}</h1>
          <p className={styles.subtitle}>Altere os dados do catálogo.</p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
            <CatalogueFormSection categories={categories} accessLevels={accessLevels} />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Guardar Alterações
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

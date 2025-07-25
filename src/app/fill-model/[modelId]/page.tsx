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
        modifiedDate: new Date(),
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
    // Logic to update the model with new resources
    console.log(data);
    setPopup({ message: 'Catálogo submetido com sucesso!', type: 'success' });
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

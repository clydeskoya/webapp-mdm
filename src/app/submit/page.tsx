'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './submit.module.css';
import { DataModelFormSection } from '@/components/DataModelFormSection';
import { useAuthStore } from '@/lib/auth-store';
import { modelsAPI } from '@/lib/api';

// Type Definitions
type DataModel = {
  label: string;
  description: string;
  author: string;
  organisation: string;
  type: string;
};

export type FormValues = {
  dataModel: DataModel;
};

export default function SubmitPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [newModelId, setNewModelId] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
      dataModel: {
        label: '',
        description: '',
        organisation: '',
        author: '',
        type: '',
      },
    },
  });

  const { handleSubmit } = methods;

  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const folderId = process.env.NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID;
      if (!folderId) {
        setPopup({ message: 'O ID da pasta não está configurado.', type: 'error' });
        return;
      }
      const response = await modelsAPI.createDataModel(folderId, {
        label: data.dataModel.label,
        description: data.dataModel.description,
        author: `${user?.firstName} ${user?.lastName}`,
        organisation: data.dataModel.organisation,
        type: "Data Asset"
      });
      setNewModelId(response.id);
      setPopup({ message: 'Modelo de dados processado com sucesso!', type: 'success' });
    } catch (error) {
      setPopup({ message: 'Falha ao processar o modelo de dados. Por favor, tente novamente.', type: 'error' });
    }
  };

  const handleGoBack = () => {
    router.push('/menu');
  };

  const handleFillModel = () => {
    if (newModelId) {
      router.push(`/fill-model/${newModelId}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.submitContainer}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>Submeter Novo Modelo de Dados</h1>
          <p className={styles.subtitle}>
            Preencha os campos para criar um novo modelo de dados.
          </p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <DataModelFormSection />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Criar Modelo de Dados
              </button>
            </div>
          </form>
        </FormProvider>

        {popup && (
          <div className={styles.popupOverlay}>
            <div className={`${styles.popup} ${styles[popup.type]}`}>
              <p>{popup.message}</p>
              {popup.type === 'success' ? (
                <div className={styles.popupActions}>
                  <button onClick={handleGoBack}>Voltar ao Menu</button>
                  <button onClick={handleFillModel}>Preencher o modelo</button>
                </div>
              ) : (
                <button onClick={() => setPopup(null)}>Fechar</button>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}''


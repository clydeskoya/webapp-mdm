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

      const dcatptId = '78a00319-8166-40a7-a058-f88f12d18164';
      const dataTypes = [
        { id: 'ba2a4d89-8025-4f5d-83f9-2ef2b8426fa6', title: 'String' },
        { id: '20aff0d8-7c0f-47cf-91dc-eafebab5c178', title: 'Date' },
        { id: '72cc84f6-89f7-4789-85b3-a9e70e4fb142', title: 'Text' },
        { id: '76774715-abad-4e74-8153-fcc7af6dcfd6', title: 'Decimal' },
        { id: '8699d228-31bb-4cec-b5f2-8c1a1b8f71fa', title: 'Níveis_Acesso' },
        { id: 'ba0027f4-a430-40ef-920f-c7bbedd82c3e', title: 'Tipo_Agente' },
        { id: '107efc7e-d600-42e7-8596-f0e2189ef90a', title: 'Categoria' },
        { id: 'f07abc44-23b7-4fa4-a57d-a6262ef7aca5', title: 'Tipo_Acto_Jurídico' },
        { id: '0f12207a-93c9-4437-8f2a-f9afa9e96620', title: 'Entidade_Pública' },
      ];

      console.log('Starting to add data types...');
      for (const dataType of dataTypes) {
        console.log(`Adding data type: ${dataType.title} (${dataType.id})`);
        await modelsAPI.addDataTypeToModel(response.id, dcatptId, dataType.id);
      }
      console.log('Finished adding data types.');

      setPopup({ message: 'Modelo de dados processado com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Error during submission process:', error);
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


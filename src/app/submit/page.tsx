'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './submit.module.css';
import { DataModelFormSection } from '@/components/DataModelFormSection';
import { modelsAPI } from '@/lib/api';

// Type Definitions
type DataModel = {
  label: string;
  description: string;
  organization: string;
};

type FormValues = {
  dataModel: DataModel;
};

export default function SubmitPage() {
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues: {
      dataModel: {
        label: '',
        description: '',
        organization: '',
      },
    },
  });

  const { handleSubmit, watch } = methods;
  const agents = watch('dataModel.organization');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await modelsAPI.createDataModel({
        label: data.dataModel.label,
        description: data.dataModel.description,
        organisation: data.dataModel.organization,
      });
      console.log('Data model created:', response);
      // Optionally, redirect to another page or show a success message
      router.push('/menu');
    } catch (error) {
      console.error('Failed to create data model:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleGoBack = () => {
    router.push('/menu');
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
          <h1 className={styles.title}>Submeter Novo Formulário</h1>
          <p className={styles.subtitle}>
            Preencha os campos para criar um novo modelo de dados.
          </p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <DataModelFormSection agents={[{ name: 'Agent 1' }, { name: 'Agent 2' }]} />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Criar Modelo de Dados
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ProtectedRoute>
  );
}

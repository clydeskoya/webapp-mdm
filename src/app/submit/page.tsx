'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider, FieldErrors } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './submit.module.css';
import { DataModelFormSection } from '@/components/DataModelFormSection';
import { useAuthStore } from '@/lib/auth-store';
import { modelsAPI } from '@/lib/api';

// Type Definitions
type Contact = {
  mail: string;
  phone: string;
};

type Agent = {
  name: string;
  description: string;
  url: string;
  id: string;
  contacts: Contact[];
};

type RecursoLegal = {
  jurisdiction: string;
  legalAct: string;
  agents: Agent[];
};

type Distribution = {
  title: string;
  description: string;
  license: string;
  format: string;
  modified: string;
  created: string;
  accessURL: string;
  downloadURL: string;
};

type Dataset = {
  title: string;
  description: string;
  distributions: Distribution[];
};

type DataModel = {
  label: string;
  description: string;
  author: string;
  organisation: string;
  type: string;
};

export type FormValues = {
  dataModel: DataModel;
  existingDataModel: string;
  submissionType: 'existing' | 'new';
  recursosLegais: RecursoLegal[];
  datasets: Dataset[];
};

export default function SubmitPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [dataModels, setDataModels] = useState<any[]>([]);

  const methods = useForm<FormValues>({
    defaultValues: {
      submissionType: 'new',
      dataModel: {
        label: '',
        description: '',
        organisation:'',
        author: '',
        type:'',
      },
    },
  });

  const { handleSubmit, watch } = methods;
  const submissionType = watch('submissionType');

  useEffect(() => {
    async function fetchDataModels() {
      try {
        const folderId = process.env.NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID;
        if (!folderId) {
          console.error('NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID is not defined');
          return;
        }
        const response = await modelsAPI.getFromFolder(folderId);
        console.log('API Response for data models:', response);
        setDataModels(response.items);
      } catch (error) {
        console.error('Failed to fetch data models:', error);
      }
    }

    fetchDataModels();
  }, []);

  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      let response;
      if (data.submissionType === 'new') {
        const folderId = process.env.NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID;
        if (!folderId) {
          setPopup({ message: 'Folder ID is not configured.', type: 'error' });
          return;
        }
        response = await modelsAPI.createDataModel(folderId, {
          label: data.dataModel.label,
          description: data.dataModel.description,
          author: `${user?.firstName} ${user?.lastName}`,
        });
      } else {
        response = await modelsAPI.getById(data.existingDataModel);
      }
      setPopup({ message: 'Data model processed successfully!', type: 'success' });
    } catch (error) {
      setPopup({ message: 'Failed to process data model. Please try again.', type: 'error' });
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
            Preencha os campos para criar um novo modelo de dados ou selecione um modelo existente.
          </p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Submissão</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    value="new"
                    {...methods.register('submissionType')}
                  />
                  Novo Modelo de Dados
                </label>
                <label>
                  <input
                    type="radio"
                    value="existing"
                    {...methods.register('submissionType')}
                  />
                  Modelo de Dados Existente
                </label>
              </div>
            </div>

            {submissionType === 'existing' && (
              <div className={styles.formGroup}>
                <label htmlFor="existingDataModel" className={styles.label}>
                  Modelos de Dados Existentes
                </label>
                <select
                  id="existingDataModel"
                  {...methods.register('existingDataModel')}
                  className={styles.select}
                >
                  <option value="">Selecione um modelo de dados</option>
                  {dataModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <DataModelFormSection disabled={submissionType === 'existing'} />

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {submissionType === 'new' ? 'Criar Modelo de Dados' : 'Submeter'}
              </button>
            </div>
          </form>
        </FormProvider>

        {popup && (
          <div className={`${styles.popup} ${styles[popup.type]}`}>
            <p>{popup.message}</p>
            <button onClick={() => setPopup(null)}>Close</button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


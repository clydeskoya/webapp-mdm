
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

export const DataModelFormSection: React.FC = () => {
  const { register, formState, getFieldState } = useFormContext<FormValues>();

  const labelError = getFieldState('dataModel.label', formState).error;
  const descriptionError = getFieldState('dataModel.description', formState).error;

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Informação do Modelo</h2>
      <div className={styles.formGroup}>
        <label htmlFor="label" className={styles.label}>
          Entidade Pública
        </label>
        <input
          id="label"
          {...register('dataModel.label', { required: 'Identifique a Entidade Pública' })}
          className={styles.input}
          placeholder="e.g., AMA"
        />
        {labelError && <p className={styles.errorMessage}>{labelError.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição
        </label>
        <textarea
          id="description"
          {...register('dataModel.description', { required: 'Preencha a descrição' })}
          className={styles.input}
          placeholder="Modelo de dados para a AMA onde estão presentes os catálogos X,Y,Z"
          rows={4}
        />
        {descriptionError && <p className={styles.errorMessage}>{descriptionError.message}</p>}
      </div>
    </div>
  );
};

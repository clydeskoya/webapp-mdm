
import React from 'react';
import { useFormContext, FieldErrors } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

interface DataModelFormSectionProps {
  disabled?: boolean;
}

export const DataModelFormSection: React.FC<DataModelFormSectionProps> = ({ disabled }) => {
  const { register, formState, getFieldState } = useFormContext<FormValues>();

  const labelError = getFieldState('dataModel.label', formState).error;
  const descriptionError = getFieldState('dataModel.description', formState).error;
  const organizationError = getFieldState('dataModel.organization', formState).error;

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Data Model Information</h2>
      <div className={styles.formGroup}>
        <label htmlFor="label" className={styles.label}>
          Label
        </label>
        <input
          id="label"
          {...register('dataModel.label', { required: !disabled && 'Label is required' })}
          className={styles.input}
          placeholder="e.g., My Awesome Data Model"
          disabled={disabled}
        />
        {labelError && <p className={styles.errorMessage}>{labelError.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          {...register('dataModel.description', { required: !disabled && 'Description is required' })}
          className={styles.input}
          placeholder="e.g., A description of my awesome data model."
          rows={4}
          disabled={disabled}
        />
        {descriptionError && <p className={styles.errorMessage}>{descriptionError.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="organization" className={styles.label}>
          Organization
        </label>
        <input
          id="organization"
          {...register('dataModel.organization', { required: !disabled && 'Organization is required' })}
          className={styles.input}
          placeholder="e.g., My Organization"
          disabled={disabled}
        />
        {organizationError && <p className={styles.errorMessage}>{organizationError.message}</p>}
      </div>
    </div>
  );
};

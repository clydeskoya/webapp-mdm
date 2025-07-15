
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';

interface DataModelFormSectionProps {
  agents: { name: string }[];
}

export const DataModelFormSection: React.FC<DataModelFormSectionProps> = ({ agents }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Data Model Information</h2>
      <div className={styles.formGroup}>
        <label htmlFor="label" className={styles.label}>
          Label
        </label>
        <input
          id="label"
          {...register('label', { required: 'Label is required' })}
          className={styles.input}
          placeholder="e.g., My Awesome Data Model"
        />
        {errors.label && <p className={styles.errorMessage}>{errors.label.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          className={styles.input}
          placeholder="e.g., A description of my awesome data model."
          rows={4}
        />
        {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="organization" className={styles.label}>
          Organization
        </label>
        <select
          id="organization"
          {...register('organization', { required: 'Organization is required' })}
          className={styles.select}
        >
          <option value="">Select an organization</option>
          {agents.map((agent, index) => (
            <option key={index} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>
        {errors.organization && <p className={styles.errorMessage}>{errors.organization.message}</p>}
      </div>
    </div>
  );
};

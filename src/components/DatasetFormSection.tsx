import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/fill-model/[modelId]/page';
import { DistributionFormSection } from '@/components/DistributionFormSection';

export const DatasetFormSection: React.FC = () => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'datasets',
  });

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Datasets</h2>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Título</label>
            <input
              {...register(`datasets.${index}.title`)}
              className={styles.input}
              placeholder="e.g., My Dataset"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`datasets.${index}.description`)}
              className={styles.input}
              placeholder="e.g., A description of my dataset."
              rows={4}
            />
          </div>
          <DistributionFormSection datasetIndex={index} />
          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Dataset
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ title: '', description: '', distributions: [] })} className={styles.addButton}>
        Adicionar Dataset
      </button>
    </div>
  );
};
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/fill-model/[modelId]/page';

interface DistributionFormSectionProps {
  datasetIndex: number;
}

export const DistributionFormSection: React.FC<DistributionFormSectionProps> = ({ datasetIndex }) => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `datasets.${datasetIndex}.distributions`,
  });

  return (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Distribuições</h3>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Título</label>
            <input
              {...register(`datasets.${datasetIndex}.distributions.${index}.title`)}
              className={styles.input}
              placeholder="e.g., My Distribution"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`datasets.${datasetIndex}.distributions.${index}.description`)}
              className={styles.input}
              placeholder="e.g., A description of my distribution."
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Licença</label>
            <input
              {...register(`datasets.${datasetIndex}.distributions.${index}.license`)}
              className={styles.input}
              placeholder="e.g., MIT"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Formato</label>
            <input
              {...register(`datasets.${datasetIndex}.distributions.${index}.format`)}
              className={styles.input}
              placeholder="e.g., CSV"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Modificado</label>
            <input
              type="date"
              {...register(`datasets.${datasetIndex}.distributions.${index}.modified`)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Criado</label>
            <input
              type="date"
              {...register(`datasets.${datasetIndex}.distributions.${index}.created`)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>URL de Acesso</label>
            <input
              {...register(`datasets.${datasetIndex}.distributions.${index}.accessURL`)}
              className={styles.input}
              placeholder="e.g., https://example.com/access"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>URL de Download</label>
            <input
              {...register(`datasets.${datasetIndex}.distributions.${index}.downloadURL`)}
              className={styles.input}
              placeholder="e.g., https://example.com/download"
            />
          </div>
          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Distribuição
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ title: '', description: '', license: '', format: '', modified: '', created: '', accessURL: '', downloadURL: '' })} className={styles.addButton}>
        Adicionar Distribuição
      </button>
    </div>
  );
};

import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/lib/types';
import { DistributionFormSection } from '@/components/DistributionFormSection';

export const DatasetFormSection: React.FC = () => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'catalogue.datasets',
  });

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Datasets</h2>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Título</label>
            <input
              {...register(`catalogue.datasets.${index}.title`)}
              className={styles.input}
              placeholder="e.g., My Dataset"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`catalogue.datasets.${index}.description`)}
              className={styles.input}
              placeholder="e.g., A description of my dataset."
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Acesso</label>
            <input
              {...register(`catalogue.datasets.${index}.access`)}
              className={styles.input}
              placeholder="e.g., public"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria</label>
            <input
              {...register(`catalogue.datasets.${index}.category`)}
              className={styles.input}
              placeholder="e.g., Demographics"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Versão</label>
            <input
              type="number"
              step="any"
              {...register(`catalogue.datasets.${index}.version`, { valueAsNumber: true })}
              className={styles.input}
              placeholder="e.g., 1.0"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de Modificação</label>
            <input
              type="date"
              {...register(`catalogue.datasets.${index}.modified_date`, { valueAsDate: true })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Idioma</label>
            <input
              {...register(`catalogue.datasets.${index}.language`)}
              className={styles.input}
              placeholder="e.g., pt"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (separadas por vírgula)</label>
            <Controller
              name={`catalogue.datasets.${index}.tags`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    field.onChange(tags);
                  }}
                  className={styles.input}
                  placeholder="e.g., tag1, tag2"
                />
              )}
            />
          </div>
          <DistributionFormSection datasetIndex={index} />
          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Dataset
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ 
          title: '', 
          description: '', 
          access: '',
          category: '',
          version: 1,
          modified_date: new Date(),
          language: '',
          tags: [],
          distributions: [] 
        })} 
        className={styles.addButton}
      >
        Adicionar Dataset
      </button>
    </div>
  );
};
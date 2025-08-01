import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/lib/types';
import { DistributionFormSection } from '@/components/DistributionFormSection';

interface DatasetFormSectionProps {
  categories: any[];
  accessLevels: any[];
}

export const DatasetFormSection: React.FC<DatasetFormSectionProps> = ({ categories, accessLevels }) => {
  console.log('Categories in DatasetFormSection:', categories);
  console.log('Access levels in DatasetFormSection:', accessLevels);
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
              placeholder="ex. My Dataset"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`catalogue.datasets.${index}.description`)}
              className={styles.input}
              placeholder="ex. A description of my dataset."
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Acesso</label>
            <select
              {...register(`catalogue.datasets.${index}.access`)}
              className={styles.input}
            >
              <option value="">Selecione um nível de acesso</option>
              {accessLevels.map((level: any) => (
                <option key={level.id} value={level.value}>
                  {level.value}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria</label>
            <select
              {...register(`catalogue.datasets.${index}.category`)}
              className={styles.input}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.value}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Versão</label>
            <input
              type="number"
              step="any"
              {...register(`catalogue.datasets.${index}.version`, { valueAsNumber: true })}
              className={styles.input}
              placeholder="ex. 1.0"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de Modificação</label>
            <input
              type="date"
              {...register(`catalogue.datasets.${index}.modified_date`)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Idioma</label>
            <select
              {...register(`catalogue.datasets.${index}.language`)}
              className={styles.input}
            >
              <option value="">Selecione um idioma</option>
              <option value="PT">PT</option>
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
              <option value="IT">IT</option>
            </select>
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
                  placeholder="ex. tag1, tag2"
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
          version: 1.0,
          modified_date: new Date().toISOString().split('T')[0],
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
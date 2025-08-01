import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/lib/types';
// Placeholders for the nested form sections
// import { AgentFormSection } from './AgentFormSection'; 
// import { RecursoLegalFormSection } from './RecursoLegalFormSection';

interface DataServiceFormSectionProps {
  accessLevels: any[];
}

export const DataServiceFormSection: React.FC<DataServiceFormSectionProps> = ({ accessLevels }) => {
  console.log('Access levels in DataServiceFormSection:', accessLevels);
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'catalogue.dataservices',
  });

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Data Services</h2>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Título</label>
            <input
              {...register(`catalogue.dataservices.${index}.title`)}
              className={styles.input}
              placeholder="ex. My Data Service"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Endpoint URL</label>
            <input
              {...register(`catalogue.dataservices.${index}.endpoint_url`)}
              className={styles.input}
              placeholder="ex. https://api.example.com/data"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Licença</label>
            <input
              {...register(`catalogue.dataservices.${index}.license`)}
              className={styles.input}
              placeholder="ex. CC-BY-4.0"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`catalogue.dataservices.${index}.description`)}
              className={styles.input}
              placeholder="ex. A description of my data service."
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Acesso</label>
            <select
              {...register(`catalogue.dataservices.${index}.access`)}
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
            <label className={styles.label}>Formato</label>
            <input
              {...register(`catalogue.dataservices.${index}.format`)}
              className={styles.input}
              placeholder="ex. JSON-LD"
            />
          </div>
          
          {/* Placeholder for Owner (Agent) Form Section */}
          <div className={styles.nestedFormSection}>
            <h3 className={styles.nestedSectionTitle}>Owner Information</h3>
            {/* Here you would embed the AgentFormSection, passing the correct index */}
            {/* <AgentFormSection parentFieldIndex={index} /> */}
          </div>

          {/* Placeholder for RecursoLegal Form Section */}
          <div className={styles.nestedFormSection}>
            <h3 className={styles.nestedSectionTitle}>Recurso Legal</h3>
            {/* Here you would embed the RecursoLegalFormSection, passing the correct index */}
            {/* <RecursoLegalFormSection parentFieldIndex={index} /> */}
          </div>

          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Data Service
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ 
          title: '', 
          endpoint_url: '',
          license: '',
          description: '',
          access: '',
          format: '',
          owner: { name: '', description: '', url: '', id: '', contacts: [] },
          recursoLegal: { jurisdiction: '', legalAct: '', agents: [] },
        })} 
        className={styles.addButton}
      >
        Adicionar Data Service
      </button>
    </div>
  );
};
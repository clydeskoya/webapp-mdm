import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/fill-model/[modelId]/page';
import { ContactFormSection } from './ContactFormSection';

interface AgentFormSectionProps {
  recursoLegalIndex: number;
}

export const AgentFormSection: React.FC<AgentFormSectionProps> = ({ recursoLegalIndex }) => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `recursosLegais.${recursoLegalIndex}.agents`,
  });

  return (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Agentes</h3>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome</label>
            <input
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${index}.name`)}
              className={styles.input}
              placeholder="e.g., My Agent"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${index}.description`)}
              className={styles.input}
              placeholder="e.g., A description of my agent."
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>URL</label>
            <input
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${index}.url`)}
              className={styles.input}
              placeholder="e.g., https://example.com/agent"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>ID</label>
            <input
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${index}.id`)}
              className={styles.input}
              placeholder="e.g., agent-001"
            />
          </div>
          <ContactFormSection recursoLegalIndex={recursoLegalIndex} agentIndex={index} />
          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Agente
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', description: '', url: '', id: '', contacts: [] })} className={styles.addButton}>
        Adicionar Agente
      </button>
    </div>
  );
};
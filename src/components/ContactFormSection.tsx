import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/fill-model/[modelId]/page';

interface ContactFormSectionProps {
  recursoLegalIndex: number;
  agentIndex: number;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({ recursoLegalIndex, agentIndex }) => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `recursosLegais.${recursoLegalIndex}.agents.${agentIndex}.contacts`,
  });

  return (
    <div className={styles.formSection}>
      <h4 className={styles.sectionTitle}>Contatos</h4>
      {fields.map((item, index) => (
        <div key={item.id} className={styles.fieldArrayItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${agentIndex}.contacts.${index}.mail`)}
              className={styles.input}
              placeholder="e.g., contact@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Telefone</label>
            <input
              {...register(`recursosLegais.${recursoLegalIndex}.agents.${agentIndex}.contacts.${index}.phone`)}
              className={styles.input}
              placeholder="e.g., 123-456-7890"
            />
          </div>
          <button type="button" onClick={() => remove(index)} className={styles.removeButton}>
            Remover Contato
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ mail: '', phone: '' })} className={styles.addButton}>
        Adicionar Contato
      </button>
    </div>
  );
};

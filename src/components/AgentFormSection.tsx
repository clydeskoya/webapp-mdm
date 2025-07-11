import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ContactFormSection } from './ContactFormSection';
import styles from '@/app/submit/submit.module.css';

interface AgentFormSectionProps {
  parentFieldName: string;
  agentIndex: number;
  removeAgent: (index: number) => void;
}

export const AgentFormSection: React.FC<AgentFormSectionProps> = ({
  parentFieldName,
  agentIndex,
  removeAgent,
}) => {
  const { register, control, formState: { errors } } = useFormContext();

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: `${parentFieldName}.${agentIndex}.contacts` as const,
  });

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h5>Agente {agentIndex + 1}</h5>
        <button type="button" onClick={() => removeAgent(agentIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${agentIndex}.name`} className={styles.label}>
          Nome do Agente
        </label>
        <input
          id={`${parentFieldName}.${agentIndex}.name`}
          {...register(`${parentFieldName}.${agentIndex}.name` as const, { required: 'O nome do agente é obrigatório' })}
          className={styles.input}
          placeholder="Ex: João Silva / Câmara Municipal de Lisboa"
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][agentIndex] && errors[parentFieldName][agentIndex].name && <p className={styles.errorMessage}>{errors[parentFieldName][agentIndex].name.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${agentIndex}.description`} className={styles.label}>
          Descrição do Agente
        </label>
        <textarea
          id={`${parentFieldName}.${agentIndex}.description`}
          {...register(`${parentFieldName}.${agentIndex}.description` as const, { required: 'A descrição do agente é obrigatória' })}
          className={styles.input}
          placeholder="Ex: Departamento responsável pela gestão de dados."
          rows={4}
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][agentIndex] && errors[parentFieldName][agentIndex].description && <p className={styles.errorMessage}>{errors[parentFieldName][agentIndex].description.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${agentIndex}.url`} className={styles.label}>
          URL do Agente
        </label>
        <input
          id={`${parentFieldName}.${agentIndex}.url`}
          type="url"
          {...register(`${parentFieldName}.${agentIndex}.url` as const)}
          className={styles.input}
          placeholder="Ex: https://www.cm-lisboa.pt"
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][agentIndex] && errors[parentFieldName][agentIndex].url && <p className={styles.errorMessage}>{errors[parentFieldName][agentIndex].url.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${agentIndex}.id`} className={styles.label}>
          ID do Agente
        </label>
        <input
          id={`${parentFieldName}.${agentIndex}.id`}
          {...register(`${parentFieldName}.${agentIndex}.id` as const)}
          className={styles.input}
          placeholder="Ex: agente-001"
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][agentIndex] && errors[parentFieldName][agentIndex].id && <p className={styles.errorMessage}>{errors[parentFieldName][agentIndex].id.message}</p>}
      </div>

      <div className={styles.formSection}>
        <h5 className={styles.sectionTitle}>Contactos do Agente {agentIndex + 1}</h5>
        <p className={styles.sectionDescription}>
          Especifique os contactos para este agente.
        </p>
        {contactFields.map((contactField, contactInnerIndex) => (
          <ContactFormSection
            key={contactField.id}
            parentFieldName={`${parentFieldName}.${agentIndex}.contacts`}
            contactIndex={contactInnerIndex}
            removeContact={removeContact}
          />
        ))}
        <button type="button" onClick={() => appendContact({ mail: '', phone: '' })} className={styles.addButton}>
          Adicionar Contacto
        </button>
      </div>
    </div>
  );
};
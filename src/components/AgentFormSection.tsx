import React from 'react';
import { useFormContext, useFieldArray, FieldErrors, Path } from 'react-hook-form';
import { ContactFormSection } from './ContactFormSection';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

type RecursoLegalAgentsPath = `recursosLegais.${number}.agents`;

interface AgentFormSectionProps {
  parentFieldName: RecursoLegalAgentsPath;
  agentIndex: number;
  removeAgent: (index: number) => void;
}

export const AgentFormSection: React.FC<AgentFormSectionProps> = ({
  parentFieldName,
  agentIndex,
  removeAgent,
}) => {
  const { register, control, formState, getFieldState } = useFormContext<FormValues>();

  const contactsFieldName = `${parentFieldName}.${agentIndex}.contacts` as Path<FormValues>;

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: contactsFieldName,
  });

  const nameFieldName = `${parentFieldName}.${agentIndex}.name` as Path<FormValues>;
  const descriptionFieldName = `${parentFieldName}.${agentIndex}.description` as Path<FormValues>;
  const urlFieldName = `${parentFieldName}.${agentIndex}.url` as Path<FormValues>;
  const idFieldName = `${parentFieldName}.${agentIndex}.id` as Path<FormValues>;

  const nameError = getFieldState(nameFieldName, formState).error;
  const descriptionError = getFieldState(descriptionFieldName, formState).error;
  const urlError = getFieldState(urlFieldName, formState).error;
  const idError = getFieldState(idFieldName, formState).error;

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h5>Agente {agentIndex + 1}</h5>
        <button type="button" onClick={() => removeAgent(agentIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={nameFieldName} className={styles.label}>
          Nome do Agente
        </label>
        <input
          id={nameFieldName}
          {...register(nameFieldName, { required: 'O nome do agente é obrigatório' })}
          className={styles.input}
          placeholder="Ex: João Silva / Câmara Municipal de Lisboa"
        />
        {nameError && <p className={styles.errorMessage}>{nameError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={descriptionFieldName} className={styles.label}>
          Descrição do Agente
        </label>
        <textarea
          id={descriptionFieldName}
          {...register(descriptionFieldName, { required: 'A descrição do agente é obrigatória' })}
          className={styles.input}
          placeholder="Ex: Departamento responsável pela gestão de dados."
          rows={4}
        />
        {descriptionError && <p className={styles.errorMessage}>{descriptionError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={urlFieldName} className={styles.label}>
          URL do Agente
        </label>
        <input
          id={urlFieldName}
          type="url"
          {...register(urlFieldName)}
          className={styles.input}
          placeholder="Ex: https://www.cm-lisboa.pt"
        />
        {urlError && <p className={styles.errorMessage}>{urlError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={idFieldName} className={styles.label}>
          ID do Agente
        </label>
        <input
          id={idFieldName}
          {...register(idFieldName)}
          className={styles.input}
          placeholder="Ex: agente-001"
        />
        {idError && <p className={styles.errorMessage}>{idError.message}</p>}
      </div>

      <div className={styles.formSection}>
        <h5 className={styles.sectionTitle}>Contactos do Agente {agentIndex + 1}</h5>
        <p className={styles.sectionDescription}>
          Especifique os contactos para este agente.
        </p>
        {contactFields.map((contactField, contactInnerIndex) => (
          <ContactFormSection
            key={contactField.id}
            parentFieldName={contactsFieldName}
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
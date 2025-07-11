import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';

interface ContactFormSectionProps {
  parentFieldName: string;
  contactIndex: number;
  removeContact: (index: number) => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  parentFieldName,
  contactIndex,
  removeContact,
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h6>Contacto {contactIndex + 1}</h6>
        <button type="button" onClick={() => removeContact(contactIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${contactIndex}.mail`} className={styles.label}>
          Email
        </label>
        <input
          id={`${parentFieldName}.${contactIndex}.mail`}
          type="email"
          {...register(`${parentFieldName}.${contactIndex}.mail` as const)}
          className={styles.input}
          placeholder="Ex: contacto@cm-lisboa.pt"
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][contactIndex] && errors[parentFieldName][contactIndex].mail && <p className={styles.errorMessage}>{errors[parentFieldName][contactIndex].mail.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`${parentFieldName}.${contactIndex}.phone`} className={styles.label}>
          Telefone
        </label>
        <input
          id={`${parentFieldName}.${contactIndex}.phone`}
          type="tel"
          {...register(`${parentFieldName}.${contactIndex}.phone` as const)}
          className={styles.input}
          placeholder="Ex: +351 21 123 4567"
        />
        {errors && errors[parentFieldName] && errors[parentFieldName][contactIndex] && errors[parentFieldName][contactIndex].phone && <p className={styles.errorMessage}>{errors[parentFieldName][contactIndex].phone.message}</p>}
      </div>
    </div>
  );
};

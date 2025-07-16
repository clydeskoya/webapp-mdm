import { useFormContext, FieldErrors, Path } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

type AgentContactsPath = `recursosLegais.${number}.agents.${number}.contacts`;

interface ContactFormSectionProps {
  parentFieldName: `recursosLegais.${number}.agents.${number}.contacts`;
  contactIndex: number;
  removeContact: (index: number) => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  parentFieldName,
  contactIndex,
  removeContact,
}) => {
  const { register, formState, getFieldState } = useFormContext<FormValues>();

  const mailFieldName = `${parentFieldName}.${contactIndex}.mail` as Path<FormValues>;
  const phoneFieldName = `${parentFieldName}.${contactIndex}.phone` as Path<FormValues>;

  const mailError = getFieldState(mailFieldName, formState).error;
  const phoneError = getFieldState(phoneFieldName, formState).error;

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h6>Contacto {contactIndex + 1}</h6>
        <button type="button" onClick={() => removeContact(contactIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={mailFieldName} className={styles.label}>
          Email
        </label>
        <input
          id={mailFieldName}
          type="email"
          {...register(mailFieldName)}
          className={styles.input}
          placeholder="Ex: contacto@cm-lisboa.pt"
        />
        {mailError && <p className={styles.errorMessage}>{mailError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={phoneFieldName} className={styles.label}>
          Telefone
        </label>
        <input
          id={phoneFieldName}
          type="tel"
          {...register(phoneFieldName)}
          className={styles.input}
          placeholder="Ex: +351 21 123 4567"
        />
        {phoneError && <p className={styles.errorMessage}>{phoneError.message}</p>}
      </div>
    </div>
  );
};

import { useFormContext, useFieldArray, FieldErrors } from 'react-hook-form';
import { AgentFormSection } from './AgentFormSection';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

interface RecursoLegalFormSectionProps {
  recursoLegalIndex: number;
  removeRecursoLegal: (index: number) => void;
  tiposActoJuridico: { key: string; value: string }[];
}

export const RecursoLegalFormSection: React.FC<RecursoLegalFormSectionProps> = ({
  recursoLegalIndex,
  removeRecursoLegal,
  tiposActoJuridico,
}) => {
  const { register, control, formState, getFieldState } = useFormContext<FormValues>();

  const { fields: nestedAgentFields, append: appendNestedAgent, remove: removeNestedAgent } = useFieldArray({
    control,
    name: `recursosLegais.${recursoLegalIndex}.agents` as const,
  });

  const jurisdictionError = getFieldState(`recursosLegais.${recursoLegalIndex}.jurisdiction`, formState).error;
  const legalActError = getFieldState(`recursosLegais.${recursoLegalIndex}.legalAct`, formState).error;

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h3>Recurso Legal {recursoLegalIndex + 1}</h3>
        <button type="button" onClick={() => removeRecursoLegal(recursoLegalIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={`recursosLegais.${recursoLegalIndex}.jurisdiction`} className={styles.label}>
          Jurisdição
        </label>
        <input
          id={`recursosLegais.${recursoLegalIndex}.jurisdiction`}
          {...register(`recursosLegais.${recursoLegalIndex}.jurisdiction` as const, { required: 'A jurisdição é obrigatória' })}
          className={styles.input}
          placeholder="Ex: PT, EU"
        />
        {jurisdictionError && <p className={styles.errorMessage}>{jurisdictionError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`recursosLegais.${recursoLegalIndex}.legalAct`} className={styles.label}>
          Tipo de Acto Jurídico
        </label>
        <select
          id={`recursosLegais.${recursoLegalIndex}.legalAct`}
          {...register(`recursosLegais.${recursoLegalIndex}.legalAct` as const, { required: 'O tipo de acto jurídico é obrigatório' })}
          className={styles.select}
        >
          <option value="">Selecione um tipo de acto jurídico</option>
          {tiposActoJuridico.map((option: { key: string; value: string }) => (
            <option key={option.key} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
        {legalActError && <p className={styles.errorMessage}>{legalActError.message}</p>}
      </div>

      <div className={styles.formSection}>
        <h4 className={styles.sectionTitle}>Agentes do Recurso Legal {recursoLegalIndex + 1}</h4>
        <p className={styles.sectionDescription}>
          Especifique os agentes associados a este recurso legal.
        </p>
        {nestedAgentFields.map((agentField, agentIndex) => (
          <AgentFormSection
            key={agentField.id}
            parentFieldName={`recursosLegais.${recursoLegalIndex}.agents`}
            agentIndex={agentIndex}
            removeAgent={removeNestedAgent}
          />
        ))}
        <button type="button" onClick={() => appendNestedAgent({ name: '', description: '', url: '', id: '', contacts: [{ mail: '', phone: '' }] })} className={styles.addButton}>
          Adicionar Agente
        </button>
      </div>
    </div>
  );
};

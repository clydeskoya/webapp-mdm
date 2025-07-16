import React from 'react';
import { useFormContext, FieldErrors } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/app/submit/page';

interface DistributionFormSectionProps {
  datasetIndex: number;
  distIndex: number;
  removeDistribution: (index: number) => void;
}

export const DistributionFormSection: React.FC<DistributionFormSectionProps> = ({
  datasetIndex,
  distIndex,
  removeDistribution,
}) => {
  const { register, formState, getFieldState } = useFormContext<FormValues>();

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h5>Distribuição {distIndex + 1}</h5>
        <button type="button" onClick={() => removeDistribution(distIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.title`} className={styles.label}>
          Título da Distribuição
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.title`}
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.title` as const, { required: 'O título da distribuição é obrigatório' })}
          className={styles.input}
          placeholder="Ex: Dados de População em CSV"
        />
        {titleError && <p className={styles.errorMessage}>{titleError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.description`} className={styles.label}>
          Descrição da Distribuição
        </label>
        <textarea
          id={`datasets.${datasetIndex}.distributions.${distIndex}.description`}
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.description` as const, { required: 'A descrição da distribuição é obrigatória' })}
          className={styles.input}
          placeholder="Ex: Ficheiro CSV contendo dados demográficos."
          rows={4}
        />
        {descriptionError && <p className={styles.errorMessage}>{descriptionError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.license`} className={styles.label}>
          Licença da Distribuição
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.license`}
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.license` as const, { required: 'A licença da distribuição é obrigatória' })}
          className={styles.input}
          placeholder="Ex: Creative Commons Zero v1.0 Universal"
        />
        {licenseError && <p className={styles.errorMessage}>{licenseError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.format`} className={styles.label}>
          Formato da Distribuição
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.format`}
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.format` as const)}
          className={styles.input}
          placeholder="Ex: CSV, JSON, XML"
        />
        {formatError && <p className={styles.errorMessage}>{formatError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.modified`} className={styles.label}>
          Data de Modificação da Distribuição
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.modified`}
          type="date"
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.modified` as const, { required: 'A data de modificação da distribuição é obrigatória' })}
          className={styles.input}
        />
        {modifiedError && <p className={styles.errorMessage}>{modifiedError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.created`} className={styles.label}>
          Data de Criação da Distribuição
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.created`}
          type="date"
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.created` as const)}
          className={styles.input}
        />
        {createdError && <p className={styles.errorMessage}>{createdError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.accessURL`} className={styles.label}>
          URL de Acesso
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.accessURL`}
          type="url"
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.accessURL` as const)}
          className={styles.input}
          placeholder="Ex: https://dados.gov.pt/dataset/populacao/distribuicao/csv"
        />
        {accessURLError && <p className={styles.errorMessage}>{accessURLError.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`datasets.${datasetIndex}.distributions.${distIndex}.downloadURL`} className={styles.label}>
          URL de Download
        </label>
        <input
          id={`datasets.${datasetIndex}.distributions.${distIndex}.downloadURL`}
          type="url"
          {...register(`datasets.${datasetIndex}.distributions.${distIndex}.downloadURL` as const)}
          className={styles.input}
          placeholder="Ex: https://dados.gov.pt/dataset/populacao/distribuicao/csv/download"
        />
        {downloadURLError && <p className={styles.errorMessage}>{downloadURLError.message}</p>}
      </div>
    </div>
  );
};

import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from '@/app/submit/submit.module.css';
import { FormValues } from '@/lib/types';

export const CatalogueFormSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Informação do Catálogo</h2>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.title" className={styles.label}>
          Título
        </label>
        <input
          id="catalogue.title"
          {...register('catalogue.title', { required: 'O título é obrigatório' })}
          className={styles.input}
          placeholder="e.g., Catálogo de Dados Abertos da AMA"
        />
        {errors.catalogue?.title && <p className={styles.errorMessage}>{errors.catalogue.title.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.description" className={styles.label}>
          Descrição
        </label>
        <textarea
          id="catalogue.description"
          {...register('catalogue.description', { required: 'A descrição é obrigatória' })}
          className={styles.input}
          placeholder="Descrição do catálogo"
          rows={4}
        />
        {errors.catalogue?.description && <p className={styles.errorMessage}>{errors.catalogue.description.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.language" className={styles.label}>
          Idioma
        </label>
        <input
          id="catalogue.language"
          {...register('catalogue.language', { required: 'O idioma é obrigatório' })}
          className={styles.input}
          placeholder="e.g., pt"
        />
        {errors.catalogue?.language && <p className={styles.errorMessage}>{errors.catalogue.language.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.modifiedDate" className={styles.label}>
          Data de Modificação
        </label>
        <input
          id="catalogue.modifiedDate"
          type="date"
          {...register('catalogue.modifiedDate', { required: 'A data de modificação é obrigatória' })}
          className={styles.input}
        />
        {errors.catalogue?.modifiedDate && <p className={styles.errorMessage}>{errors.catalogue.modifiedDate.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.homepage" className={styles.label}>
          Página Principal
        </label>
        <input
          id="catalogue.homepage"
          {...register('catalogue.homepage', { required: 'A página principal é obrigatória' })}
          className={styles.input}
          placeholder="e.g., https://dados.gov.pt"
        />
        {errors.catalogue?.homepage && <p className={styles.errorMessage}>{errors.catalogue.homepage.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="catalogue.owner" className={styles.label}>
          Proprietário
        </label>
        <input
          id="catalogue.owner"
          {...register('catalogue.owner', { required: 'O proprietário é obrigatório' })}
          className={styles.input}
          placeholder="e.g., Agência para a Modernização Administrativa"
        />
        {errors.catalogue?.owner && <p className={styles.errorMessage}>{errors.catalogue.owner.message}</p>}
      </div>
    </div>
  );
};
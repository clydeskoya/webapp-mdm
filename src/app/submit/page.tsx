'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { submissionsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './submit.module.css';

// Resource types available
const RESOURCE_TYPES = [
  { id: 'dataset', label: 'Dataset', description: 'Conjunto de dados estruturados' },
  { id: 'dataservice', label: 'Data Service', description: 'Serviço de dados' },
  { id: 'catalogue', label: 'Catalogue', description: 'Catálogo de metadados' },
  { id: 'distribution', label: 'Distribution', description: 'Distribuição de dados' },
  { id: 'agent', label: 'Agent', description: 'Agente ou organização' },
];

// Metadata fields for each resource type
const METADATA_FIELDS: Record<string, Array<{
  name: string;
  label: string;
  type: string;
  required: boolean;
}>> = {
  dataset: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'keywords', label: 'Palavras-chave', type: 'text', required: false },
    { name: 'theme', label: 'Tema', type: 'text', required: false },
    { name: 'language', label: 'Idioma', type: 'text', required: false },
  ],
  dataservice: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'endpoint', label: 'Endpoint URL', type: 'text', required: true },
    { name: 'protocol', label: 'Protocolo', type: 'text', required: false },
  ],
  catalogue: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'homepage', label: 'Página Inicial', type: 'text', required: false },
    { name: 'publisher', label: 'Editor', type: 'text', required: false },
  ],
  distribution: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'format', label: 'Formato', type: 'text', required: true },
    { name: 'accessURL', label: 'URL de Acesso', type: 'text', required: false },
  ],
  agent: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea', required: true },
    { name: 'email', label: 'Email', type: 'email', required: false },
    { name: 'website', label: 'Website', type: 'text', required: false },
  ],
};

interface ResourceMetadata {
  id: string;
  type: string;
  metadata: Record<string, string>;
}

interface SubmitForm {
  resources: ResourceMetadata[];
}

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SubmitForm>({
    defaultValues: {
      resources: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'resources',
  });

  // Group resources by type for display
  const resourcesByType = fields.reduce((acc, resource, index) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push({ ...resource, index });
    return acc;
  }, {} as Record<string, Array<ResourceMetadata & { index: number }>>);

  const onSubmit = async (data: SubmitForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Count resources by type
      const resourceCounts = data.resources.reduce((acc, resource) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalResources = data.resources.length;
      const resourceTypes = Object.keys(resourceCounts);

      // Prepare the submission data
      const submissionData = {
        title: `Submissão de ${totalResources} recursos`,
        description: `Submissão contendo: ${resourceTypes.map(type => 
          `${resourceCounts[type]} ${RESOURCE_TYPES.find(r => r.id === type)?.label}${resourceCounts[type] > 1 ? 's' : ''}`
        ).join(', ')}`,
        data: {
          resources: data.resources,
          resourceCounts,
        },
      };

      await submissionsAPI.create(submissionData);
      setSubmitSuccess(true);
      reset();

      // Redirect to menu after 2 seconds
      setTimeout(() => {
        router.push('/menu');
      }, 2000);
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 'Erro ao submeter formulário'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/menu');
  };

  const addResource = (resourceType: string) => {
    const newResource: ResourceMetadata = {
      id: `${resourceType}-${Date.now()}`,
      type: resourceType,
      metadata: {},
    };
    append(newResource);
  };

  const removeResource = (index: number) => {
    remove(index);
  };

  const renderMetadataField = (field: {
    name: string;
    label: string;
    type: string;
    required: boolean;
  }, resourceIndex: number) => {
    const fieldId = `resources.${resourceIndex}.metadata.${field.name}`;
    const hasError = errors.resources?.[resourceIndex]?.metadata?.[field.name as keyof typeof field];

    if (field.type === 'textarea') {
      return (
        <textarea
          {...register(fieldId as any, {
            required: field.required ? `${field.label} é obrigatório` : false,
          })}
          className={`${styles.formInput} ${hasError ? styles.error : ''}`}
          placeholder={`Introduza ${field.label.toLowerCase()}`}
          rows={3}
          disabled={isSubmitting}
        />
      );
    }

    return (
      <input
        {...register(fieldId as any, {
          required: field.required ? `${field.label} é obrigatório` : false,
        })}
        type={field.type}
        className={`${styles.formInput} ${hasError ? styles.error : ''}`}
        placeholder={`Introduza ${field.label.toLowerCase()}`}
        disabled={isSubmitting}
      />
    );
  };

  return (
    <ProtectedRoute>
      <div className={styles.submitContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerFlex}>
              <button
                onClick={handleBack}
                className={styles.backButton}
              >
                ← Voltar
              </button>
              <h1 className={styles.headerTitle}>
                Submeter Recursos
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <div className={styles.card}>
              {submitSuccess ? (
                <div className={styles.successContainer}>
                  <div className={styles.successIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className={styles.successTitle}>
                    Recursos Submetidos com Sucesso!
                  </h2>
                  <p className={styles.successMessage}>
                    Os seus recursos foram enviados e estão a ser processados.
                  </p>
                  <p className={styles.successRedirect}>
                    A ser redirecionado para o menu...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                  {/* Resource Type Selection */}
                  <div className={styles.resourceSelection}>
                    <label className={styles.formLabel}>
                      Adicione recursos selecionando o tipo:
                    </label>
                    <div className={styles.resourceGrid}>
                      {RESOURCE_TYPES.map((resource) => (
                        <button
                          key={resource.id}
                          type="button"
                          onClick={() => addResource(resource.id)}
                          className={styles.resourceOption}
                          disabled={isSubmitting}
                        >
                          <div>
                            <div className={styles.resourceLabel}>+ {resource.label}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {resource.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resource Metadata Sections */}
                  {Object.keys(resourcesByType).length > 0 && (
                    <div className={styles.resourceSections}>
                      {Object.entries(resourcesByType).map(([resourceType, resources]) => {
                        const resource = RESOURCE_TYPES.find(r => r.id === resourceType);
                        const metadataFields = METADATA_FIELDS[resourceType];

                        return (
                          <div key={resourceType} className={styles.resourceSection}>
                            <div className={styles.resourceSectionHeader}>
                              <h3 className={styles.resourceSectionTitle}>
                                {resource?.label} ({resources.length})
                              </h3>
                              <button
                                type="button"
                                onClick={() => addResource(resourceType)}
                                className={styles.addButton}
                                disabled={isSubmitting}
                              >
                                + Adicionar {resource?.label}
                              </button>
                            </div>
                            
                            {resources.map((resourceInstance, instanceIndex) => (
                              <div key={resourceInstance.id} className={styles.resourceInstance}>
                                <div className={styles.instanceHeader}>
                                  <h4 className={styles.instanceTitle}>
                                    {resource?.label} #{instanceIndex + 1}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => removeResource(resourceInstance.index)}
                                    className={styles.removeButton}
                                    disabled={isSubmitting}
                                  >
                                    ✕ Remover
                                  </button>
                                </div>
                                
                                <div className={styles.resourceMetadata}>
                                  {metadataFields.map((field) => (
                                    <div key={field.name} className={styles.formGroup}>
                                      <label className={styles.formLabel}>
                                        {field.label} {field.required && '*'}
                                      </label>
                                      {renderMetadataField(field, resourceInstance.index)}
                                      {errors.resources?.[resourceInstance.index]?.metadata?.[field.name as keyof typeof field] && (
                                        <p className={styles.errorMessage}>
                                          {errors.resources?.[resourceInstance.index]?.metadata?.[field.name as keyof typeof field]?.message}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {submitError && (
                    <div className={styles.errorMessage} style={{ textAlign: 'center' }}>
                      {submitError}
                    </div>
                  )}

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={handleBack}
                      className={styles.cancelButton}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting || fields.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={styles.spinner}></div>
                          A submeter...
                        </>
                      ) : (
                        `Submeter ${fields.length} Recurso${fields.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 
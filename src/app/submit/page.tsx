'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { submissionsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SubmitForm {
  title: string;
  description: string;
  dataType: string;
  dataContent: string;
  priority: 'low' | 'medium' | 'high';
}

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitForm>({
    defaultValues: {
      priority: 'medium',
    },
  });

  const onSubmit = async (data: SubmitForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the submission data
      const submissionData = {
        title: data.title,
        description: data.description,
        data: {
          type: data.dataType,
          content: data.dataContent,
          priority: data.priority,
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="btn btn-secondary mr-4"
              >
                ← Voltar
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Submeter Novo Formulário
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="card">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Formulário Submetido com Sucesso!
                  </h2>
                  <p className="text-gray-600">
                    A sua submissão foi enviada e está a ser processada.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    A ser redirecionado para o menu...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="title" className="form-label">
                      Título *
                    </label>
                    <input
                      id="title"
                      type="text"
                      className={`form-input ${errors.title ? 'error' : ''}`}
                      placeholder="Introduza um título descritivo"
                      {...register('title', {
                        required: 'Título é obrigatório',
                        minLength: {
                          value: 3,
                          message: 'Título deve ter pelo menos 3 caracteres',
                        },
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.title && (
                      <p className="error-message">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Descrição *
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className={`form-input ${errors.description ? 'error' : ''}`}
                      placeholder="Descreva os detalhes da sua submissão"
                      {...register('description', {
                        required: 'Descrição é obrigatória',
                        minLength: {
                          value: 10,
                          message: 'Descrição deve ter pelo menos 10 caracteres',
                        },
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className="error-message">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dataType" className="form-label">
                      Tipo de Dados *
                    </label>
                    <select
                      id="dataType"
                      className={`form-input ${errors.dataType ? 'error' : ''}`}
                      {...register('dataType', {
                        required: 'Tipo de dados é obrigatório',
                      })}
                      disabled={isSubmitting}
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="json">JSON</option>
                      <option value="xml">XML</option>
                      <option value="csv">CSV</option>
                      <option value="text">Texto</option>
                      <option value="binary">Binário</option>
                    </select>
                    {errors.dataType && (
                      <p className="error-message">{errors.dataType.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dataContent" className="form-label">
                      Conteúdo dos Dados *
                    </label>
                    <textarea
                      id="dataContent"
                      rows={6}
                      className={`form-input font-mono text-sm ${errors.dataContent ? 'error' : ''}`}
                      placeholder="Cole ou introduza os seus dados aqui..."
                      {...register('dataContent', {
                        required: 'Conteúdo dos dados é obrigatório',
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.dataContent && (
                      <p className="error-message">{errors.dataContent.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority" className="form-label">
                      Prioridade
                    </label>
                    <select
                      id="priority"
                      className="form-input"
                      {...register('priority')}
                      disabled={isSubmitting}
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  {submitError && (
                    <div className="error-message text-center">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-secondary flex-1"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner mr-2"></div>
                          A submeter...
                        </>
                      ) : (
                        'Submeter Formulário'
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
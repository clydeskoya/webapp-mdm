'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { submissionsAPI, Submission } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './menu.module.css';

export default function MenuPage() {
  const { user, logout } = useAuthStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentSubmissions();
  }, []);

  const loadRecentSubmissions = async () => {
    try {
      setIsLoading(true);
      const recentSubmissions = await submissionsAPI.getRecent(5);
      setSubmissions(recentSubmissions);
    } catch (err: any) {
      setError('Erro ao carregar submissões recentes');
      console.error('Error loading submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.menuContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerFlex}>
              <div>
                <h1 className={styles.headerTitle}>
                  Sistema de Gestão de Dados Mauro
                </h1>
                <p className={styles.headerSubtitle}>
                  Bem-vindo, {user?.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
                title="Terminar Sessão"
              >
                <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v10m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentGrid}>
            {/* Quick Actions */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ações Rápidas</h2>
              <div className={styles.quickActions}>
                <Link href="/submit" className={styles.actionLink}>
                  <div className={styles.actionContent}>
                    <div className={styles.actionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className={styles.actionText}>
                      <h3>Submeter Novo Formulário</h3>
                      <p>Criar uma nova submissão de dados</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className={styles.card}>
              <div className={styles.submissionsHeader}>
                <h2 className={styles.cardTitle}>Submissões Recentes</h2>
                <button
                  onClick={loadRecentSubmissions}
                  className={styles.refreshButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'A carregar...' : 'Atualizar'}
                </button>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <span>A carregar submissões...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Nenhuma submissão encontrada</p>
                </div>
              ) : (
                <div className={styles.submissionsList}>
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={styles.submissionItem}
                    >
                      <div className={styles.submissionHeader}>
                        <h3 className={styles.submissionTitle}>
                          {submission.title}
                        </h3>
                        <span
                          className={`${styles.submissionStatus} ${getStatusClass(submission.status)}`}
                        >
                          {getStatusText(submission.status)}
                        </span>
                      </div>
                      <p className={styles.submissionDescription}>
                        {submission.description}
                      </p>
                      <p className={styles.submissionDate}>
                        Criado em: {formatDate(submission.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 
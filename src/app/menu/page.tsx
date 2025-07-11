'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './menu.module.css';

export default function MenuPage() {
  const { user, logout } = useAuthStore();
  

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className={styles.menuContainer}>
        <div className={styles.menuHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerFlex}>
              <div>
                <h1 className={styles.headerTitle}>
                  Sistema de Gestão de Dados Mauro
                </h1>
                <p className={styles.headerSubtitle}>
                  Bem-vindo, {user?.firstName} {user?.lastName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
                title="Terminar Sessão"
              >
                <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 2v10" />
                </svg>
              </button>
            </div>
          </div>
        </div>

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
                      <h3>1 - Submeter Novo Modelo de Dados</h3>
                      <p>Criar uma nova submissão de dados</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className={styles.quickActions}>
                <Link href="" className={styles.actionLink}>
                  <div className={styles.actionContent}>
                    <div className={styles.actionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className={styles.actionText}>
                      <h3>2 - Editar Modelo de Dados</h3>
                      <p>Selecione um dos modelos disponíveis e altere ou adicione recursos</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 
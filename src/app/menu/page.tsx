'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './menu.module.css';
import { modelsAPI } from '@/lib/api';

export default function MenuPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [dataModels, setDataModels] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    async function fetchDataModels() {
      try {
        const folderId = process.env.NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID;
        if (!folderId) {
          console.error('NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID is not defined');
          return;
        }
        const response = await modelsAPI.getFromFolder(folderId);
        setDataModels(response.items);
      } catch (error) {
        console.error('Failed to fetch data models:', error);
      }
    }

    if (isModalOpen) {
      fetchDataModels();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleModalClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleLogout = () => {
    logout();
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleConfirmEdit = () => {
    if (selectedModel) {
      router.push(`/fill-model/${selectedModel}`);
    }
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
              <h2 className={styles.cardTitle}>Menu</h2>
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
                <button onClick={handleEditClick} className={styles.actionLink}>
                  <div className={styles.actionContent}>
                    <div className={styles.actionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                      </svg>
                    </div>
                    <div className={styles.actionText}>
                      <h3>2 - Editar Modelos de Dados Existentes</h3>
                      <p>Selecione um dos modelos disponíveis e altere ou adicione recursos</p>
                    </div>
                  </div>
                </button>
                <Link href="/edit-dataset-schema" className={styles.actionLink}>
                  <div className={styles.actionContent}>
                    <div className={styles.actionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                    <div className={styles.actionText}>
                      <h3>3 - Editar Esquemas de Conjuntos de Dados</h3>
                      <p>Modifique os esquemas de conjuntos de dados existentes</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Catalogs, Datasets, and Data Models */}
            <div className={styles.card}>
              <div className={styles.submissionsHeader}>
                <h2 className={styles.cardTitle}>Recentes</h2>
                <button className={styles.refreshButton}>Atualizar</button>
              </div>
              <div className={styles.submissionsList}>
                {/* Mock Data for Catalogs */}
                <div className={styles.submissionItem}>
                  <div className={styles.submissionHeader}>
                    <h3 className={styles.submissionTitle}>Catálogo de Dados Abertos</h3>
                    <span className={`${styles.submissionStatus} ${styles.statusApproved}`}>Catálogo</span>
                  </div>
                  <p className={styles.submissionDescription}>Catálogo principal de dados abertos da cidade.</p>
                  <p className={styles.submissionDate}>Última atualização: 2024-07-10</p>
                </div>
                {/* Mock Data for Datasets */}
                <div className={styles.submissionItem}>
                  <div className={styles.submissionHeader}>
                    <h3 className={styles.submissionTitle}>População por Freguesia 2023</h3>
                    <span className={`${styles.submissionStatus} ${styles.statusPending}`}>Dataset</span>
                  </div>
                  <p className={styles.submissionDescription}>Dados demográficos detalhados por freguesia.</p>
                  <p className={styles.submissionDate}>Última atualização: 2024-06-25</p>
                </div>
                {/* Mock Data for Data Models */}
                <div className={styles.submissionItem}>
                  <div className={styles.submissionHeader}>
                    <h3 className={styles.submissionTitle}>Modelo de Dados de Transportes Públicos</h3>
                    <span className={`${styles.submissionStatus} ${styles.statusRejected}`}>Modelo de Dados</span>
                  </div>
                  <p className={styles.submissionDescription}>Estrutura de dados para informações de transportes.</p>
                  <p className={styles.submissionDate}>Última atualização: 2024-07-01</p>
                </div>
              </div>
            </div>

            
          </div>

          {/* Browse by Type */}
          <div className={styles.browseByType}>
            <h2 className={styles.cardTitle}>Navegar por Tipo</h2>
            <div className={styles.typeIcons}>
              <Link href="/catalogs" className={styles.typeIconLink}>
                <div className={styles.typeIconContent}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7-7V3" />
                  </svg>
                  <span>Catálogo</span>
                </div>
              </Link>
              <Link href="/datasets" className={styles.typeIconLink}>
                <div className={styles.typeIconContent}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Dataset</span>
                </div>
              </Link>
              <Link href="/data-services" className={styles.typeIconLink}>
                <div className={styles.typeIconContent}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Serviço de Dados</span>
                </div>
              </Link>
              <Link href="/agents" className={styles.typeIconLink}>
                <div className={styles.typeIconContent}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Agente</span>
                </div>
              </Link>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Selecione um Modelo de Dados para Editar</h2>
              <select onChange={handleModelSelect} value={selectedModel} className={styles.modalSelect}>
                <option value="">Selecione um modelo</option>
                {dataModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
              <div className={styles.modalActions}>
                <button onClick={handleModalClose} className={styles.modalButton}>
                  Cancelar
                </button>
                <button onClick={handleConfirmEdit} className={`${styles.modalButton} ${styles.confirm}`} disabled={!selectedModel}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 
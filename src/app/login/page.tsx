'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/auth-store';
import styles from './login.module.css';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/menu');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    clearError();
    await login(data.username, data.password);
  };

  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.headerText}>
          <h1 className={styles.headerTitle}>Iniciar Sessão</h1>
          <p className={styles.headerSubtitle}>Introduza as suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formSpaceY6}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Nome de Utilizador
            </label>
            <input
              id="username"
              type="text"
              className={`${styles.formInput} ${errors.username ? styles.error : ''}`}
              {...register('username', { required: 'Nome de utilizador é obrigatório' })}
              disabled={isLoading}
            />
            {errors.username && (
              <p className={styles.errorMessage}>{errors.username.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
              {...register('password', { required: 'Palavra-passe é obrigatória' })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className={`${styles.errorMessage} ${styles.textCenter}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={`${styles.spinner} ${styles.spinnerMr2}`}></div>
                A iniciar sessão...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        

        <div className={`${styles.mt6} ${styles.textCenter}`}>
          <p className={`${styles.textSm} ${styles.textGray600}`}>
            Sistema de Gestão de Dados Mauro
          </p>
        </div>
      </div>
    </div>
  );
} 
/**
 * ═══════════════════════════════════════════════════════
 * lib/auth-provider.tsx — Fournisseur d'authentification React
 * ═══════════════════════════════════════════════════════
 *
 * - Écoute l'AuthEventBus pour les déconnexions forcées
 * - Gère le state utilisateur global
 * - Expose useAuth() hook dans toute l'application
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authEventBus } from '@/lib/auth-event-bus';
import { apiHelpers } from '@/lib/api';
import type { LoginResponse, UserRole, SubscriptionPlan } from '@reclamtrack/shared';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AuthUser {
  id:      string;
  email:   string;
  nom:     string;
  prenom:  string;
  role:    UserRole;
  plan:    SubscriptionPlan;
  farmId?: string;
}

interface AuthContextType {
  user:      AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login:     (email: string, password: string) => Promise<void>;
  logout:    () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur au montage (si cookie valide)
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiHelpers.auth.me();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  // ── Écoute de l'AuthEventBus ─────────────────
  useEffect(() => {
    // Sur 401 → déconnexion propre et redirection
    const cleanup = authEventBus.on('session-expired', () => {
      console.warn('[Auth] Session invalide / expirée');
      setUser(null);
      router.push('/login?reason=session_expired');
    });

    return cleanup;
  }, [router]);

  // ─────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const result = await apiHelpers.auth.login({ email, password }) as LoginResponse;
    setUser(result.user as AuthUser);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await apiHelpers.auth.logout();
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const logoutAll = useCallback(async () => {
    try {
      await apiHelpers.auth.logoutAll();
    } finally {
      setUser(null);
      router.push('/login?reason=all_sessions_revoked');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      logoutAll,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
};

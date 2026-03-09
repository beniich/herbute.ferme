'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { authEventBus } from '@/lib/auth-event-bus';
import { useAuthStore } from '@/store/authStore';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setIsLoading: setStoreLoading } = useAuthStore();
  const [isLoading, setLoading] = useState(true); // Always true on first render to avoid mismatch
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkSession = async () => {
    try {
      setLoading(true);
      
      // -- MOCK ACCESS BYPASS (Provisoire) --
      if (searchParams?.get('mock') === 'true') {
        setUser({
          id: 'mock-123',
          name: 'Expert AgroMaître (Mock)',
          email: 'mock@herbute.com',
          role: 'admin',
          organizationId: 'org-mock-123'
        });
        setLoading(false);
        setStoreLoading(false);
        return;
      }

      const data = await authApi.me();
      // Le backend retourne { user: {...} } ou directement l'objet user
      const userObj = data?.user ?? data;
      setUser(userObj ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  useEffect(() => {
    // Si l'user est déjà en cache Zustand (persist), ne pas refaire l'API call immédiatement
    // On vérifie quand même en arrière-plan après 100ms pour valider que la session est toujours valide
    if (user) {
      setLoading(false);
      setStoreLoading(false);
      // Validation silencieuse en arrière-plan (sans spinner)
      const timer = setTimeout(() => {
        authApi.me().then((data) => {
          const userObj = data?.user ?? data;
          if (!userObj) setUser(null);
          else setUser(userObj);
        }).catch(() => {
          setUser(null);
        });
      }, 500);
      
      const unsubscribe = authEventBus.on('session-expired', () => {
        setUser(null);
        router.push('/login');
      });
      
      return () => { clearTimeout(timer); unsubscribe(); };
    } else {
      // Pas de session en cache : vérification complète
      checkSession();
    }

    const unsubscribe = authEventBus.on('session-expired', () => {
      setUser(null);
      router.push('/login');
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const response = await authApi.login(data);
    // Après le login, le cookie est posé par le backend
    // On récupère les données user depuis la réponse ou on appelle /me
    const userObj = response?.user ?? null;
    const from = searchParams.get('from') || '/dashboard';

    if (userObj) {
      setUser(userObj);
      setLoading(false);
      router.push(from);
    } else {
      // Fallback : on vérifie la session
      await checkSession();
      router.push(from);
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

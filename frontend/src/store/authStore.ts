import { authApi } from '@/lib/api';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (credential: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    checkAuth: () => Promise<void>;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),
            setToken: (token) => {
                set({ token });
                if (typeof window !== 'undefined') {
                    if (token) {
                        localStorage.setItem('auth_token', token);
                        // Sync with middleware cookie
                        document.cookie = `reclamtrack-auth-storage=${token}; path=/; max-age=604800; SameSite=Lax`;
                    } else {
                        localStorage.removeItem('auth_token');
                        document.cookie = 'reclamtrack-auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    }
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.login({ email, password });
                    const { user, accessToken: token } = response as any;

                    // Ensure user is not null
                    if (!user || !token) {
                        throw new Error('Réponse invalide du serveur');
                    }

                    set({ user, token, isLoading: false });

                    if (typeof window !== 'undefined' && token) {
                        localStorage.setItem('auth_token', token);
                        document.cookie = `reclamtrack-auth-storage=${token}; path=/; max-age=604800; SameSite=Lax`;
                    }
                } catch (error: any) {
                    const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Identifiants invalides';
                    set({
                        isLoading: false,
                        error: errorMsg
                    });
                    throw error;
                }
            },

            googleLogin: async (credential) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.googleLogin(credential);
                    const { user, accessToken: token } = response as any;

                    if (!user || !token) {
                         throw new Error('Réponse invalide du serveur');
                    }

                    set({ user, token, isLoading: false });

                    if (typeof window !== 'undefined' && token) {
                        localStorage.setItem('auth_token', token);
                        document.cookie = `reclamtrack-auth-storage=${token}; path=/; max-age=604800; SameSite=Lax`;
                    }
                } catch (error: any) {
                    const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Échec de la connexion Google';
                    set({
                        isLoading: false,
                        error: errorMsg
                    });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, token: null });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    document.cookie = 'reclamtrack-auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    // Detect current locale from URL to maintain i18n context
                    const pathLocale = window.location.pathname.split('/')[1];
                    const locale = ['fr', 'en'].includes(pathLocale) ? pathLocale : 'fr';
                    window.location.href = `/${locale}/login`;
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const user = await authApi.me();
                    set({ user, isLoading: false });
                } catch {
                    // console.error(error);
                    set({ user: null, token: null, isLoading: false });
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                    }
                }
            },

            // Hydration state
            _hasHydrated: false,
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state })
        }),
        {
            name: 'reclamtrack-auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);

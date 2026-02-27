'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { API_ROUTES } from '@reclamtrack/shared';

interface AuthResponse {
    token: string;
    user: { id: string; email: string; name: string; avatar?: string; role: 'admin' | 'dispatcher' | 'staff' };
}

/** Hook simplifié pour login / register / logout */
export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, setToken, logout } = useAuthStore();

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.auth.login, {
                email,
                password
            });
            setToken(response.token);
            setUser(response.user);
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);
            }
            return true;
        } catch (e: unknown) {
            setError(e instanceof Error && 'response' in e ? (e as any).response?.data?.message : 'Erreur de connexion');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post<AuthResponse>(API_ROUTES.auth.register, {
                email,
                password
            });
            setToken(response.token);
            setUser(response.user);
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);
            }
            return true;
        } catch (e: unknown) {
            setError(e instanceof Error && 'response' in e ? (e as any).response?.data?.message : "Erreur d'inscription");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { user, login, register, logout, loading, error };
};

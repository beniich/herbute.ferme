'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkAuth, token, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (_hasHydrated && token) {
            console.log('[AuthProvider] Hydrated with token, verifying auth...');
            checkAuth();
        }
    }, [_hasHydrated, token, checkAuth]);

    return <>{children}</>;
}

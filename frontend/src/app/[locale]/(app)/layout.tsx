'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';
import AgroLayout from '@/components/layout/AgroLayout';
import useNotifications from '@/hooks/useNotifications';
import { useOrgStore } from '@/store/orgStore';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const { fetchOrganizations } = useOrgStore();
    const router = useRouter();
    useNotifications();

    useEffect(() => {
        if (!isLoading && user) {
            fetchOrganizations();
        }
    }, [user, isLoading, fetchOrganizations]);

    useEffect(() => {
        if (!isLoading && !user) {
            console.log('[AppLayout] Redirecting to login — Session missing');
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Spinner pendant la vérification de session
    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5FBE6' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderLeftColor: '#215E61',
                        borderRightColor: '#215E61',
                        borderBottomColor: '#215E61',
                        borderTopColor: 'transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Chargement de votre session...</p>
                </div>
            </div>
        );
    }

    // Pas encore d'utilisateur (redirection en cours)
    // Affiche un écran de chargement au lieu de `return null` qui cause une page blanche
    if (!user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5FBE6' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderLeftColor: '#9ca3af',
                        borderRightColor: '#9ca3af',
                        borderBottomColor: '#9ca3af',
                        borderTopColor: 'transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p style={{ fontSize: '14px', color: '#9ca3af' }}>Redirection...</p>
                </div>
            </div>
        );
    }

    return (
        <AgroLayout>
            {children}
        </AgroLayout>
    );
}

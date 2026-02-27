'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import { Footer } from '@/components/layout/Footer';
import useNotifications from '@/hooks/useNotifications';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const { _hasHydrated, token } = useAuthStore();
    const router = useRouter();
    useNotifications();

    useEffect(() => {
        if (_hasHydrated && !user && !token) {
            console.log('[AppLayout] Redirecting to login: No user and no token found after hydration.');
            router.push('/login');
        }
    }, [user, token, _hasHydrated, router]);

    if (!_hasHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Initialisation...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}

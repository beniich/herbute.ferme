'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const { checkAuth } = useAuthStore();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        if (sessionId) {
            // In a real app, you might want to call an API to verify the session
            // and update local user state immediately
            const verify = async () => {
                try {
                    // Simulate verification delay or call API
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    await checkAuth(); // Refresh user state (roles, plan, etc.)
                } finally {
                    setVerifying(false);
                }
            };
            verify();
        } else {
            setVerifying(false);
        }
    }, [sessionId, checkAuth]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0e0e1b] dark:text-[#f8f8fc] min-h-screen font-display flex flex-col items-center justify-center p-6">
            <div className="bg-white dark:bg-[#1a1a30] p-8 rounded-2xl shadow-xl border border-[#d0d0e7] dark:border-[#2a2a4a] max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-[#4d4d99] dark:text-[#a0a0d0] mb-8">
                    Thank you for your subscription. Your account has been upgraded and you now have access to premium features.
                </p>

                {verifying ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 mb-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Finalizing your account setup...
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Button
                            className="w-full gap-2"
                            onClick={() => router.push('/dashboard')}
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Link
                            href="/settings/billing"
                            className="block text-sm text-primary hover:underline"
                        >
                            View Billing Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

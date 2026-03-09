'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';
import {
    Crown,
    Zap,
    BarChart3,
    Users,
    CreditCard,
    XCircle,
    CheckCircle2,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

interface Subscription {
    plan: string;
    status: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    maxUsers?: number;
    features?: string[];
    stripeSubscriptionId?: string;
}

const PLAN_LABELS: Record<string, string> = {
    starter: 'Essentiel',
    pro: 'Professionnel',
    enterprise: 'Sur Mesure',
    essai: 'Période d\'Essai',
    trial: 'Période d\'Essai',
    none: 'Aucun abonnement',
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
    starter: <Zap size={24} />,
    pro: <BarChart3 size={24} />,
    enterprise: <Crown size={24} />,
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: 'Actif', color: 'text-emerald-500' },
    trialing: { label: 'Essai en cours', color: 'text-blue-500' },
    past_due: { label: 'Paiement en retard', color: 'text-amber-500' },
    canceled: { label: 'Annulé', color: 'text-red-500' },
    unpaid: { label: 'Impayé', color: 'text-red-500' },
    none: { label: 'Inactif', color: 'text-[var(--text3)]' },
};

export default function SubscriptionManagement() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [mocking, setMocking] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/api/billing/subscription');
            setSubscription(data);
        } catch {
            // No subscription yet — show empty state
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu\'à la fin de la période en cours.')) return;
        try {
            setCancelling(true);
            await apiClient.post('/api/billing/cancel');
            toast.success('Abonnement annulé. Il sera actif jusqu\'à la fin de la période.');
            fetchSubscription();
        } catch (err: any) {
            toast.error(err?.message || 'Erreur lors de l\'annulation');
        } finally {
            setCancelling(false);
        }
    };

    const handleMockUpgrade = async () => {
        try {
            setMocking(true);
            await apiClient.post('/api/billing/mock-checkout');
            toast.success('Plan mis à jour en mode Enterprise (démonstration)');
            fetchSubscription();
        } catch (err: any) {
            toast.error(err?.message || 'Erreur lors de la mise à niveau');
        } finally {
            setMocking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[240px] gap-3 text-[var(--text3)]">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">Chargement...</span>
            </div>
        );
    }

    const plan = subscription?.plan || 'none';
    const status = subscription?.status || 'none';
    const statusInfo = STATUS_LABELS[status] || { label: status, color: 'text-[var(--text3)]' };
    const periodEnd = subscription?.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="flex flex-col gap-6">
            {/* Current Plan Card */}
            <div className="p-6 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] flex flex-col md:flex-row md:items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                    plan === 'enterprise' ? 'bg-purple-600' :
                    plan === 'pro' ? 'bg-blue-600' :
                    plan === 'starter' ? 'bg-[var(--green)]' :
                    'bg-[var(--bg3)]'
                }`}>
                    {PLAN_ICONS[plan] || <CreditCard size={24} />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-lg text-[var(--text)] uppercase italic">
                            Plan {PLAN_LABELS[plan] || plan}
                        </h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                        {subscription?.cancelAtPeriodEnd && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                                Annulation prévue
                            </span>
                        )}
                    </div>
                    {periodEnd && (
                        <p className="text-xs text-[var(--text3)] mt-1.5 font-bold">
                            {subscription?.cancelAtPeriodEnd ? 'Se termine le' : 'Renouvellé le'} : {periodEnd}
                        </p>
                    )}
                    {subscription?.maxUsers && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text3)]">
                            <Users size={12} />
                            <span>{subscription.maxUsers} utilisateurs max</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                    <a
                        href="/pricing"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--gold)] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                        Changer de plan <ArrowUpRight size={14} />
                    </a>
                    {subscription?.stripeSubscriptionId && !subscription.cancelAtPeriodEnd && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text3)] hover:text-red-500 hover:border-red-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {cancelling ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                            Annuler
                        </button>
                    )}
                </div>
            </div>

            {/* Features included */}
            {subscription?.features && subscription.features.length > 0 && (
                <div className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text3)] mb-4">
                        Fonctionnalités incluses
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {subscription.features.map(f => (
                            <div key={f} className="flex items-center gap-2 text-xs text-[var(--text2)]">
                                <CheckCircle2 size={14} className="text-[var(--green)] shrink-0" />
                                <span className="font-medium">{f.replace(':', ' › ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dev / Demo upgrade */}
            {process.env.NODE_ENV !== 'production' && (
                <div className="p-5 rounded-2xl border border-dashed border-amber-400/40 bg-amber-500/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">
                        🔧 Mode Développement
                    </div>
                    <p className="text-xs text-[var(--text3)] mb-4">Simuler un abonnement Enterprise sans passer par Stripe.</p>
                    <button
                        onClick={handleMockUpgrade}
                        disabled={mocking}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50"
                    >
                        {mocking ? <Loader2 size={12} className="animate-spin" /> : <Crown size={12} />}
                        Activer Enterprise (Mock)
                    </button>
                </div>
            )}
        </div>
    );
}

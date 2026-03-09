import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';

interface Plan {
    id: string;
    name: string;
    priceMonthly: number | null;
    priceYearly: number | null;
    currency: string;
    maxUsers: number;
    features: string[];
    popular?: boolean;
}

interface StripeState {
    plans: Plan[];
    isLoading: boolean;
    error: string | null;
    fetchPlans: () => Promise<void>;
    createCheckoutSession: (planId: string, interval: 'month' | 'year') => Promise<string | null>;
}

export const useStripeStore = create<StripeState>()(
    persist(
        (set) => ({
            plans: [],
            isLoading: false,
            error: null,

            fetchPlans: async () => {
                set({ isLoading: true, error: null });
                try {
                    const data = await apiClient.get('/api/billing/plans');
                    // apiClient.get unwraps { success, data } automatically
                    const plans = Array.isArray(data) ? data : (data?.data ?? []);
                    set({ plans });
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Impossible de charger les plans';
                    set({ error: message });
                } finally {
                    set({ isLoading: false });
                }
            },

            createCheckoutSession: async (planId, interval) => {
                set({ isLoading: true, error: null });
                try {
                    // Use /api/billing/create-checkout with { plan, interval }
                    const data = await apiClient.post('/api/billing/create-checkout', {
                        plan: planId,
                        interval,
                    });
                    const url = data?.url || data?.data?.url;
                    if (url) return url;
                    throw new Error('URL de paiement manquante');
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Impossible de créer la session de paiement';
                    set({ error: message });
                    return null;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'stripe-storage',
            partialize: (state) => ({ plans: state.plans }),
        }
    )
);

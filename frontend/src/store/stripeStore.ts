import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
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
                    const response = await api.get('/billing/plans');
                    set({ plans: response.data?.data || [] });
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to fetch plans';
                    set({ error: message });
                } finally {
                    set({ isLoading: false });
                }
            },

            createCheckoutSession: async (planId, interval) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/billing/create-checkout-session', { planId, interval });
                    if (response.data && response.data.url) {
                        return response.data.url;
                    }
                    throw new Error('No checkout URL returned');
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to initiate checkout';
                    set({ error: message });
                    return null;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'stripe-storage',
            partialize: (state) => ({ plans: state.plans }), // Only persist plans
        }
    )
);

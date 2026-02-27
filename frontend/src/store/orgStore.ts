import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization, Membership } from '@/types';
import { organizationsApi } from '@/lib/api';

interface OrgState {
    organizations: Organization[];
    memberships: Membership[];
    activeOrganization: Organization | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchOrganizations: () => Promise<void>;
    setActiveOrganization: (orgId: string) => void;
    clearOrganizations: () => void;

    // Hydration
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useOrgStore = create<OrgState>()(
    persist(
        (set, get) => ({
            organizations: [],
            memberships: [],
            activeOrganization: null,
            isLoading: false,
            error: null,

            fetchOrganizations: async () => {
                set({ isLoading: true, error: null });
                try {
                    const memberships = await organizationsApi.getMyOrganizations() as Membership[];
                    const organizations = memberships.map((m) => {
                        if (typeof m.organizationId === 'string') return null;
                        return m.organizationId;
                    }).filter(Boolean) as Organization[];

                    set({
                        organizations,
                        memberships,
                        isLoading: false
                    });

                    // If no active org but we have orgs, auto-select first one or check storage
                    const currentActive = get().activeOrganization;
                    if (!currentActive && organizations.length > 0) {
                        // The persist middleware might have loaded it, but if not:
                        set({ activeOrganization: organizations[0] });
                        localStorage.setItem('active_organization_id', organizations[0]._id);
                    } else if (currentActive && !organizations.find(o => o._id === currentActive._id)) {
                        // Current active org no longer in list
                        set({ activeOrganization: organizations[0] || null });
                        if (organizations[0]) {
                            localStorage.setItem('active_organization_id', organizations[0]._id);
                        } else {
                            localStorage.removeItem('active_organization_id');
                        }
                    }
                } catch (error: unknown) {
                    const message = error instanceof Error
                        ? (error as any).response?.data?.message || error.message
                        : 'Erreur lors du chargement des organisations';
                    set({
                        isLoading: false,
                        error: message
                    });
                }
            },

            setActiveOrganization: (orgId: string) => {
                const org = get().organizations.find(o => o._id === orgId);
                if (org) {
                    set({ activeOrganization: org });
                    localStorage.setItem('active_organization_id', org._id);
                    // Force refresh or redirect if needed
                }
            },

            clearOrganizations: () => {
                set({ organizations: [], memberships: [], activeOrganization: null });
                localStorage.removeItem('active_organization_id');
            },

            _hasHydrated: false,
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state })
        }),
        {
            name: 'reclamtrack-org-storage',
            partialize: (state) => ({ activeOrganization: state.activeOrganization }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
                // Also ensure localStorage is in sync if state was restored
                if (state?.activeOrganization) {
                    localStorage.setItem('active_organization_id', state.activeOrganization._id);
                }
            }
        }
    )
);

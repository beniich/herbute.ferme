'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Calendar as CalendarIcon, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { KanbanBoard } from '@/components/planning/KanbanBoard';
import { InterventionCalendar } from '@/components/planning/InterventionCalendar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PlanningPage() {
    const queryClient = useQueryClient();

    // Fetch Interventions
    const { data: interventions, isLoading: loadingInterventions, error: errorInterventions } = useQuery({
        queryKey: ['interventions'],
        queryFn: async () => {
            const res = await api.get('/planning/interventions');
            // Convert strings to Date objects
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return res.map((inv: any) => ({
                ...inv,
                id: inv._id, // Add id if missing (backend uses _id)
                start: new Date(inv.start),
                end: new Date(inv.end),
                teamName: inv.teamId?.name || 'Inconnue',
                assignedTechnicians: inv.assignedTechnicians || []
            }));
        }
    });

    // Fetch Teams
    const { data: teams, isLoading: loadingTeams } = useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const res = await api.get('/teams');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return res.map((t: any) => ({
                id: t._id,
                name: t.name,
                color: t.color || '#3b82f6'
            }));
        }
    });

    // Mutations
    const updateMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (updated: any) => {
            const { id, ...data } = updated;
            return api.patch(`/planning/interventions/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    });

    const createMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (newInv: any) => {
            return api.post('/planning/interventions', newInv);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
            toast.success('Intervention planifiée');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Erreur lors de la planification');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/planning/interventions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: () => {
            toast.error('Erreur lors de la suppression');
        }
    });

    const [view, setView] = useState<'calendar' | 'kanban'>('kanban');

    if (loadingInterventions || loadingTeams) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background-light dark:bg-background-dark">
                <LoadingSpinner />
            </div>
        );
    }

    if (errorInterventions) {
        return (
            <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center bg-background-light dark:bg-background-dark gap-4">
                <p className="text-red-500 font-bold">Erreur de chargement du planning</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Réessayer</button>
            </div>
        );
    }

    return (
        <section className="h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark flex flex-col overflow-hidden transition-colors">
            {/* Mockup Header Style */}
            <div className="flex flex-col bg-white dark:bg-[#1A2633] border-b border-slate-200 dark:border-slate-800 shrink-0 z-20">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" aria-label="Go back">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Planning Opérationnel</h1>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mr-2">
                            <button 
                                onClick={() => setView('kanban')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                    view === 'kanban' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                )}
                            >
                                Kanban
                            </button>
                            <button 
                                onClick={() => setView('calendar')}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                    view === 'calendar' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                )}
                            >
                                Calendrier
                            </button>
                        </div>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" aria-label="More options">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {view === 'calendar' ? (
                    <div className="h-full p-4 lg:p-6 overflow-y-auto">
                        <InterventionCalendar
                            interventions={interventions || []}
                            teams={teams || []}
                            onInterventionUpdate={async (updated: any) => { updateMutation.mutate(updated); }}
                            onInterventionCreate={async (created: any) => { createMutation.mutate(created); }}
                            onInterventionDelete={async (id: string) => { deleteMutation.mutate(id); }}
                            editable={true}
                        />
                    </div>
                ) : (
                    <KanbanBoard 
                        interventions={interventions || []} 
                        onInterventionClick={(item) => {
                            // Open detail logic here if needed
                        }}
                    />
                )}
            </div>

            {/* Floating Action Button */}
            <button className="absolute bottom-24 right-4 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform z-30" aria-label="Add new intervention">
                <span className="material-symbols-outlined text-[28px]">add</span>
            </button>
        </section>
    );
}

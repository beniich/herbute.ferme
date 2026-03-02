'use client';

import React, { useEffect, useState } from 'react';
import { itTicketsApi, complaintsApi } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            itTicketsApi.getAll().catch(() => ({ data: [] })),
            complaintsApi.getAll().catch(() => ({ data: [] }))
        ]).then(([it, comp]) => {
            const itTasks = (it.data || []).map((t: any) => ({ ...t, source: 'IT' }));
            const compTasks = (comp.data || []).map((c: any) => ({ ...c, source: 'Réclamation' }));
            setTasks([...itTasks, ...compTasks].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime()));
        }).finally(() => setLoading(false));
    }, []);

    const getStatusBadge = (status: string) => {
        const s = (status || '').toLowerCase();
        if (s.includes('new') || s.includes('nouvel')) return <span className="pill pill-blue">Nouvelle</span>;
        if (s.includes('resolu') || s.includes('clos') || s.includes('termin')) return <span className="pill pill-green">Terminé</span>;
        return <span className="pill pill-gold">En Cours</span>;
    };

    return (
        <div className="page active" id="page-tasks">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--red)' }}>Organisation</div>
                    <h1 className="page-title">Gestion des Tâches</h1>
                    <div className="page-sub">Centralisation des interventions, missions et suivi qualité</div>
                </div>

                <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                        <div className="kpi-icon">📋</div>
                        <div className="kpi-label">Total Tâches</div>
                        <div className="kpi-value">{tasks.length || 0}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
                        <div className="kpi-icon">⏱️</div>
                        <div className="kpi-label">En Attente</div>
                        <div className="kpi-value">{tasks.filter(t => (t.status||'').toLowerCase().includes('nouvelle')).length}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
                        <div className="kpi-icon">🚨</div>
                        <div className="kpi-label">Priorité Haute</div>
                        <div className="kpi-value">{tasks.filter(t => (t.priority||'').toLowerCase() === 'high').length}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">✅</div>
                        <div className="kpi-label">Réalisées ce mois</div>
                        <div className="kpi-value">12<span className="kpi-unit"></span></div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Liste des interventions</div>
                        <button style={{ background: 'var(--green)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Nouvelle Tâche</button>
                    </div>
                    
                    <div className="panel-body" style={{ padding: 0 }}>
                        {loading ? (
                            <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                                <LoadingSpinner />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucune tâche trouvée.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Source</th>
                                        <th>Priorité</th>
                                        <th>Statut</th>
                                        <th>Créé le</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task._id}>
                                            <td style={{ fontWeight: 700 }}>{task.title}</td>
                                            <td style={{ fontFamily: 'var(--font-mono)' }}>{task.source}</td>
                                            <td style={{ color: task.priority === 'high' ? 'var(--red)' : 'var(--text2)' }}>{task.priority || 'Normal'}</td>
                                            <td>{getStatusBadge(task.status)}</td>
                                            <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date(task.createdAt||Date.now()).toLocaleDateString('fr-FR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
            </div>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/feedback')
            .then(res => {
                const data = res?.data?.data || res?.data || [];
                setFeedbacks(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const avgRating = feedbacks.length > 0 
        ? (feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / feedbacks.length).toFixed(1)
        : '0.0';

    const recentCount = feedbacks.filter(f => {
        const d = new Date(f.createdAt || Date.now());
        return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const handledCount = feedbacks.filter(f => f.status === 'treated' || f.status === 'resolved').length;
    const handledPercent = feedbacks.length > 0 ? ((handledCount / feedbacks.length) * 100).toFixed(0) : '0';

    return (
        <div className="page active" id="page-feedback">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--gold)' }}>Administration</div>
                    <h1 className="page-title">Feedback &amp; Sondages</h1>
                    <div className="page-sub">Retour d'expérience des ouvriers et qualité de vie au travail</div>
                </div>

                <div className="kpi-grid kpi-grid-3" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">😄</div>
                        <div className="kpi-label">Satisfaction Générale</div>
                        <div className="kpi-value">{avgRating}<span className="kpi-unit">/5</span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                        <div className="kpi-icon">📝</div>
                        <div className="kpi-label">Réponses Récentes (7j)</div>
                        <div className="kpi-value">{recentCount}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
                        <div className="kpi-icon">💡</div>
                        <div className="kpi-label">Suggestions Traitées</div>
                        <div className="kpi-value">{handledPercent}<span className="kpi-unit">%</span></div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Boîte à Idées</div>
                    </div>
                    <div className="panel-body" style={{ padding: 0 }}>
                        {loading ? (
                            <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                                <LoadingSpinner />
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucun feedback trouvé.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Utilisateur</th>
                                        <th>Catégorie</th>
                                        <th>Avis / Note</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map((f, i) => (
                                        <tr key={f._id || i}>
                                            <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date(f.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td style={{ fontWeight: 700 }}>{f.userId || 'Anonyme'}</td>
                                            <td>{f.category || 'Général'}</td>
                                            <td>
                                                <span style={{ color: 'var(--gold2)' }}>
                                                    {'⭐'.repeat(Math.round(f.rating || 0))}
                                                </span> ({f.comment})
                                            </td>
                                            <td>
                                                {f.status === 'new' ? <span className="pill pill-blue">Nouveau</span> : <span className="pill pill-green">Traité</span>}
                                            </td>
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

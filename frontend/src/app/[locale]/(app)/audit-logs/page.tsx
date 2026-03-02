'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import PageHeader from '@/components/layout/PageHeader';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/admin/audit-logs')
            .then(res => {
                const data = res?.data?.data || res?.data || [];
                setLogs(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const totalLogs = logs.length;
    const alertLogs = logs.filter(l => (l.action || '').toLowerCase().includes('alert')).length;
    const loginLogs = logs.filter(l => (l.action || '').toLowerCase().includes('login') || (l.action || '').toLowerCase().includes('auth')).length;

    const getActionType = (action: string) => {
        const a = (action || '').toUpperCase();
        if (a.includes('CREATE') || a.includes('ADD')) return <span style={{ color: 'var(--green2)', fontWeight: 'bold' }}>[CREATE]</span>;
        if (a.includes('UPDATE') || a.includes('EDIT')) return <span style={{ color: 'var(--gold2)', fontWeight: 'bold' }}>[UPDATE]</span>;
        if (a.includes('DELETE') || a.includes('REMOVE')) return <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>[DELETE]</span>;
        if (a.includes('VIEW') || a.includes('READ')) return <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>[VIEW]</span>;
        if (a.includes('LOGIN')) return <span style={{ color: 'var(--emerald)', fontWeight: 'bold' }}>[AUTH]</span>;
        return <span style={{ color: 'var(--text2)', fontWeight: 'bold' }}>[{a.substring(0, 10) || 'SYSTEM'}]</span>;
    };

    return (
        <div className="page active" id="page-audit">
            <PageHeader 
                label="Administration"
                title="Journaux d'Audit"
                subtitle="Historique de sécurité et traçabilité des opérations"
            />

            <div className="kpi-grid kpi-grid-4">
                <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                    <div className="kpi-icon">🔍</div>
                    <div className="kpi-label">Événements Récents</div>
                    <div className="kpi-value">{totalLogs}</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
                    <div className="kpi-icon">🚨</div>
                    <div className="kpi-label">Alertes Système</div>
                    <div className="kpi-value">{alertLogs}</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                    <div className="kpi-icon">👤</div>
                    <div className="kpi-label">Connexions (Auth)</div>
                    <div className="kpi-value">{loginLogs}</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--brown)' } as React.CSSProperties}>
                    <div className="kpi-icon">💾</div>
                    <div className="kpi-label">Intégrité</div>
                    <div className="kpi-value">Optimale</div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Dernières actions système</div>
                    <div className="panel-actions" style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-panel">Filtrer</button>
                        <button className="btn btn-primary">Exporter CSV</button>
                    </div>
                </div>
                <div className="panel-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
                    ) : logs.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucun journal d'audit</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Horodatage</th>
                                    <th>Utilisateur</th>
                                    <th>Action</th>
                                    <th>IP / Appareil</th>
                                    <th>Détails</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, i) => (
                                    <tr key={log._id || i}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                                            {new Date(log.timestamp || log.createdAt || Date.now()).toLocaleString('fr-FR')}
                                        </td>
                                        <td style={{ fontWeight: 700 }}>{log.userId?.name || log.user || log.userId || 'Système'}</td>
                                        <td>
                                            {getActionType(log.action)} {log.action}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>
                                            {log.ipAddress || 'Internal'}
                                        </td>
                                        <td style={{ color: 'var(--text2)', fontSize: '12px' }}>
                                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '-'}
                                            {log.targetType ? ` (${log.targetType})` : ''}
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

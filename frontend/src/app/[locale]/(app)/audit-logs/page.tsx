'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Shield, AlertTriangle, Search, Download, Activity, User, Clock, Filter } from 'lucide-react';

const SEVERITY_STYLE: Record<string, string> = {
    info:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ACTION_BADGE: Record<string, string> = {
    CREATE: 'bg-emerald-500/10 text-emerald-400',
    UPDATE: 'bg-blue-500/10 text-blue-400',
    DELETE: 'bg-red-500/10 text-red-400',
    LOGIN:  'bg-violet-500/10 text-violet-400',
    LOGOUT: 'bg-zinc-500/10 text-zinc-400',
    EXPORT: 'bg-amber-500/10 text-amber-400',
    IMPORT: 'bg-cyan-500/10 text-cyan-400',
    AI_GENERATION: 'bg-primary/10 text-primary',
    AI_ALERT: 'bg-orange-500/10 text-orange-400',
    INVOICE_GENERATED: 'bg-green-500/10 text-green-400',
    PDF_GENERATED: 'bg-teal-500/10 text-teal-400',
    WHATSAPP_SENT: 'bg-green-600/10 text-green-500',
    QUOTA_EXCEEDED: 'bg-red-600/10 text-red-500',
    MEMBER_INVITED: 'bg-sky-500/10 text-sky-400',
    MEMBER_REMOVED: 'bg-rose-500/10 text-rose-400',
    LOGIN_FAILED: 'bg-red-700/20 text-red-400 font-bold',
};

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: '50', page: String(page) });
            if (search)        params.set('search', search);
            if (filterSeverity) params.set('severity', filterSeverity);
            if (filterAction)  params.set('action', filterAction);

            const [logsRes, statsRes] = await Promise.all([
                apiClient.get(`/api/audit-logs?${params}`),
                apiClient.get('/api/audit-logs/stats'),
            ]);

            setLogs(logsRes.data?.data?.logs || []);
            setPagination(logsRes.data?.data?.pagination || { total: 0, pages: 1 });
            setStats(statsRes.data?.data || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [page, filterSeverity, filterAction]);

    const handleExport = () => {
        window.open('/api/audit-logs/export.csv', '_blank');
    };

    const criticalCount = stats?.bySeverity?.find((s: any) => s._id === 'critical')?.count || 0;
    const warningCount  = stats?.bySeverity?.find((s: any) => s._id === 'warning')?.count || 0;
    const infoCount     = stats?.bySeverity?.find((s: any) => s._id === 'info')?.count || 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0b0f0a] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="text-[10px] font-mono tracking-[3px] text-zinc-500 uppercase mb-1 flex items-center gap-2">
                        <Shield size={12} className="text-primary" /> Sécurité & Conformité
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Journal d'Audit</h1>
                    <p className="text-sm text-zinc-500 mt-1">Traçabilité complète de toutes les actions critiques</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
                >
                    <Download size={16} /> Exporter CSV
                </button>
            </div>

            {/* Stats KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total (7j)', value: pagination.total, icon: <Activity size={18} />, color: 'text-blue-400' },
                    { label: 'Critiques', value: criticalCount, icon: <AlertTriangle size={18} />, color: 'text-red-400', onClick: () => setFilterSeverity(filterSeverity === 'critical' ? '' : 'critical') },
                    { label: 'Avertissements', value: warningCount, icon: <AlertTriangle size={18} />, color: 'text-amber-400', onClick: () => setFilterSeverity(filterSeverity === 'warning' ? '' : 'warning') },
                    { label: 'Info', value: infoCount, icon: <Shield size={18} />, color: 'text-emerald-400' },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        onClick={kpi.onClick}
                        className={`bg-zinc-950 border border-zinc-900 rounded-2xl p-5 ${kpi.onClick ? 'cursor-pointer hover:border-zinc-700' : ''} transition-colors`}
                    >
                        <div className={`${kpi.color} mb-2`}>{kpi.icon}</div>
                        <div className="text-2xl font-bold text-white">{kpi.value ?? '—'}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur, une action..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchLogs()}
                        className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-primary/50"
                    />
                </div>
                <select
                    value={filterSeverity}
                    onChange={e => setFilterSeverity(e.target.value)}
                    className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary/50"
                >
                    <option value="">Toutes sévérités</option>
                    <option value="critical">🔴 Critique</option>
                    <option value="warning">🟡 Avertissement</option>
                    <option value="info">🔵 Info</option>
                </select>
                <select
                    value={filterAction}
                    onChange={e => setFilterAction(e.target.value)}
                    className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-primary/50"
                >
                    <option value="">Toutes actions</option>
                    {['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','LOGIN_FAILED','EXPORT','IMPORT','AI_GENERATION','AI_ALERT','INVOICE_GENERATED','QUOTA_EXCEEDED','MEMBER_INVITED','MEMBER_REMOVED'].map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-16"><LoadingSpinner /></div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500">
                        <Shield size={40} className="mx-auto mb-4 text-zinc-700" />
                        <p>Aucune entrée d'audit trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-900/60 border-b border-zinc-900">
                                <tr>
                                    {['Horodatage', 'Utilisateur', 'Action', 'Module', 'Sévérité', 'IP'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                                {logs.map((log, i) => (
                                    <tr key={log._id || i} className="hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-5 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                                                    {(log.userEmail?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium text-xs">{log.userName || log.userEmail?.split('@')[0]}</div>
                                                    <div className="text-zinc-600 text-[10px]">{log.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${ACTION_BADGE[log.action] || 'bg-zinc-700/50 text-zinc-400 border-zinc-700'}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-zinc-400 text-xs">
                                            <span className="font-medium">{log.resource}</span>
                                            {log.description && <span className="block text-zinc-600 text-[10px] mt-0.5">{log.description}</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${SEVERITY_STYLE[log.severity] || SEVERITY_STYLE.info}`}>
                                                {log.severity}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-[10px] text-zinc-600">
                                            {log.ipAddress || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-900">
                        <span className="text-xs text-zinc-500">{pagination.total} entrées au total</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white disabled:opacity-40">Précédent</button>
                            <span className="px-3 py-1.5 text-xs text-zinc-500">Page {page} / {pagination.pages}</span>
                            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white disabled:opacity-40">Suivant</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


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

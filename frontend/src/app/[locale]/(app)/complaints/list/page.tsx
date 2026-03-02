'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import api from '@/lib/api';
import { Complaint } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ComplaintListPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        const toastId = toast.loading('Génération de l\'export Excel...');
        try {
            const result = await api.get('/api/analytics/export/complaints');
            toast.dismiss(toastId);
            if (result?.data?.mode === 'local' && result?.data?.downloadUrl) {
                toast.success('Export prêt ! Téléchargement en cours...');
                window.open(result.data.downloadUrl, '_blank');
            } else if (result?.data?.mode === 'google_drive' && result?.data?.driveViewLink) {
                toast.success('Export sauvegardé sur Google Drive !');
                window.open(result.data.driveViewLink, '_blank');
            } else {
                toast.success(result?.message || 'Export réussi !');
            }
        } catch (err: unknown) {
            toast.dismiss(toastId);
            toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'export');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        api.get('/api/complaints')
            .then((res) => setComplaints(res?.data || []))
            .catch((err) => {
                console.error(err);
                setComplaints([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const getStatusBadge = (status: string) => {
        if (!status) return null;
        const s = status.toLowerCase();
        if (s.includes('nouvell')) return <span className="pill pill-blue">Nouvelle</span>;
        if (s.includes('resolu') || s.includes('termin')) return <span className="pill pill-green">Résolue</span>;
        return <span className="pill pill-gold">En Cours</span>;
    };

    return (
        <div className="page active" id="page-complaints">
            <div style={{ padding: '24px' }}>
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="page-label" style={{ color: 'var(--red)' }}>Administration</div>
                        <h1 className="page-title">Réclamations</h1>
                        <div className="page-sub">Gestion des réclamations et requêtes externes</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            style={{ 
                                background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', 
                                padding: '8px 16px', borderRadius: '8px', cursor: exporting ? 'wait' : 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            {exporting ? 'Export...' : 'Exporter Excel'}
                        </button>
                        <Link href="/complaints/new" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'var(--gold)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Nouvelle Réclamation</button>
                        </Link>
                    </div>
                </div>

                <div className="kpi-grid kpi-grid-3" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                        <div className="kpi-icon">📋</div>
                        <div className="kpi-label">Total Réclamations</div>
                        <div className="kpi-value">{complaints.length}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
                        <div className="kpi-icon">🚨</div>
                        <div className="kpi-label">Nouvelles</div>
                        <div className="kpi-value">{complaints.filter(c => (c.status||'').toLowerCase().includes('nouvelle')).length}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">✅</div>
                        <div className="kpi-label">Résolues</div>
                        <div className="kpi-value">{complaints.filter(c => (c.status||'').toLowerCase().includes('resolue')).length}<span className="kpi-unit"></span></div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Liste des Réclamations</div>
                    </div>
                    <div className="panel-body" style={{ padding: 0 }}>
                        {loading ? (
                            <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                                <LoadingSpinner />
                            </div>
                        ) : complaints.length === 0 ? (
                            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucune réclamation trouvée.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>N° Ticket</th>
                                        <th style={{ width: '20%' }}>Nom / Prénom</th>
                                        <th style={{ width: '25%' }}>Nature</th>
                                        <th style={{ width: '15%' }}>Statut</th>
                                        <th style={{ width: '15%' }}>Date</th>
                                        <th style={{ width: '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map(complaint => (
                                        <tr key={complaint._id}>
                                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                                #{complaint._id.substring(complaint._id.length - 6).toUpperCase()}
                                            </td>
                                            <td style={{ fontWeight: 700 }}>{complaint.applicantName}</td>
                                            <td>{complaint.nature}</td>
                                            <td>{getStatusBadge(complaint.status)}</td>
                                            <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date(complaint.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <Link href={`/complaints/${complaint._id}`} style={{ textDecoration: 'none' }}>
                                                    <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)' }}>Détails</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

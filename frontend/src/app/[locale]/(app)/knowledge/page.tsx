'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function KnowledgePage() {
    const [sops, setSops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/api/knowledge/sops')
            .then(res => {
                const data = res?.data?.data || res?.data || [];
                setSops(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredSops = sops.filter(sop => 
        (sop.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (sop.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Agriculture', 'Machinerie', 'Sécurité', 'Général'];

    return (
        <div className="page active" id="page-knowledge">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--gold)' }}>Rapports & Outils</div>
                    <h1 className="page-title">Base de Connaissances</h1>
                    <div className="page-sub">Procédures, manuels agricoles et bonnes pratiques</div>
                </div>

                <div className="kpi-grid kpi-grid-3" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">📚</div>
                        <div className="kpi-label">Procédures Publiées</div>
                        <div className="kpi-value">{sops.length}<span className="kpi-unit">articles</span></div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <input 
                        type="text" 
                        placeholder="Rechercher dans la base..." 
                        style={{ flex: 1, padding: '16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '15px' }} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button style={{ background: 'var(--gold)', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Rechercher</button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><LoadingSpinner /></div>
                ) : filteredSops.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucune procédure trouvée</div>
                ) : (
                    <div className="content-grid cg-3">
                        {categories.map(cat => {
                            const catSops = filteredSops.filter(s => s.category?.toLowerCase().includes(cat.toLowerCase()) || (cat === 'Général' && !s.category));
                            if (catSops.length === 0 && cat !== 'Général') return null;

                            return (
                                <div className="panel" key={cat}>
                                    <div className="panel-header"><div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>{cat}</div></div>
                                    <div className="panel-body">
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {catSops.map(sop => (
                                                <li key={sop._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                                    <div style={{ fontSize: '24px' }}>📑</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{sop.title}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{sop.views || 0} vues</div>
                                                    </div>
                                                </li>
                                            ))}
                                            {cat === 'Général' && catSops.length === 0 && (
                                                 <li style={{ color: 'var(--text3)' }}>Aucun document dans cette catégorie</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
        </div>
    );
}

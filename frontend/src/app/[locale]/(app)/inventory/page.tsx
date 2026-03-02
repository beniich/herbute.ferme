'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface InventoryItem {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    currentStock: number;
    minStock: number;
    price: number;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/api/inventory/items')
            .then(res => {
                if (res?.data?.data) {
                    setItems(res.data.data);
                } else if (Array.isArray(res?.data)) {
                    setItems(res.data);
                } else if (Array.isArray(res)) {
                    setItems(res as any);
                }
            })
            .catch(err => console.error('Erreur inventaire:', err))
            .finally(() => setLoading(false));
    }, []);

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalItems = items.length;
    const lowStockItems = items.filter(i => i.currentStock <= i.minStock).length;
    const totalValue = items.reduce((acc, curr) => acc + (curr.currentStock * curr.price), 0);
    const categoryCounts = items.reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="page active" id="page-inventory">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--brown)' }}>Rapports & Outils</div>
                    <h1 className="page-title">Inventaire &amp; Stocks</h1>
                    <div className="page-sub">Gestion des intrants, engrais, matériels et approvisionnements</div>
                </div>

                <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">📦</div>
                        <div className="kpi-label">Articles en Stock</div>
                        <div className="kpi-value">{totalItems}<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
                        <div className="kpi-icon">⚠️</div>
                        <div className="kpi-label">Stock Faible</div>
                        <div className="kpi-value">{lowStockItems}<span className="kpi-unit">alertes</span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
                        <div className="kpi-icon">🛒</div>
                        <div className="kpi-label">Commandes en cours</div>
                        <div className="kpi-value">3<span className="kpi-unit"></span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                        <div className="kpi-icon">💸</div>
                        <div className="kpi-label">Valeur du Stock</div>
                        <div className="kpi-value">{(totalValue / 1000).toFixed(1)}<span className="kpi-unit">k MAD</span></div>
                    </div>
                </div>

                <div className="content-grid cg-2" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <div className="panel">
                        <div className="panel-header"><div className="panel-title">Catégories</div></div>
                        <div className="panel-body">
                            {loading ? <LoadingSpinner /> : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {Object.entries(categoryCounts).map(([cat, count]: [string, any], index) => {
                                        const emojis = ['🌱', '🧪', '🛡️', '🪛', '💧'];
                                        return (
                                            <li key={cat} style={{ padding: '12px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                {emojis[index % emojis.length]} {cat} ({count})
                                            </li>
                                        );
                                    })}
                                    {Object.keys(categoryCounts).length === 0 && (
                                        <li style={{ color: 'var(--text3)', textAlign: 'center', padding: '12px' }}>Aucune catégorie</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    <div className="panel">
                        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Mouvements Récents</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Rechercher..." 
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button style={{ background: 'var(--gold)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Entrée Stock</button>
                            </div>
                        </div>
                        <div className="panel-body" style={{ padding: 0 }}>
                            {loading ? (
                                <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                                    <LoadingSpinner />
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>Aucun article trouvé.</div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Référence</th>
                                            <th>Article</th>
                                            <th>Catégorie</th>
                                            <th>Quantité</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.map(item => (
                                            <tr key={item.id || item.code}>
                                                <td style={{ fontFamily: 'var(--font-mono)' }}>{item.code}</td>
                                                <td style={{ fontWeight: 700 }}>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td style={{ fontWeight: 'bold', color: item.currentStock <= item.minStock ? 'var(--red)' : 'inherit' }}>
                                                    {item.currentStock} {item.unit}
                                                </td>
                                                <td>
                                                    {item.currentStock <= item.minStock 
                                                        ? <span className="pill pill-red">Stock Faible</span>
                                                        : <span className="pill pill-green">En Stock</span>
                                                    }
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

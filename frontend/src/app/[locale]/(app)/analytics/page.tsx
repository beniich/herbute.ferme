'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import PageHeader from '@/components/layout/PageHeader';

const COLORS = ['#3a7ab8', '#5a9e45', '#c8921a', '#c0392b', '#8e44ad', '#2c3e50'];

export default function AnalyticsPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const res = await api.get('/dashboard');
            return res;
        }
    });

    if (isLoading) {
        return (
            <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                <p style={{ color: 'var(--red)', fontWeight: 'bold' }}>Erreur de chargement analytique</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const trendData = stats?.trends || [];
    const categoryData = stats?.byCategory?.map((c: any) => ({ name: c._id, value: c.count })) || [];
    const activeCount = (stats?.byStatus?.['soumise'] || 0) + (stats?.byStatus?.['en_cours'] || 0);

    return (
        <div className="page active" id="page-analytics">
            <PageHeader 
                label="Exploration Analytique"
                title="Operational Intelligence"
                subtitle="Analyse en temps réel de la performance du domaine."
                actions={
                  <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-panel">30 Jours</button>
                      <button className="btn btn-primary">Exporter</button>
                  </div>
                }
            />

            <div className="kpi-grid kpi-grid-4">
                <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
                    <div className="kpi-icon">📊</div>
                    <div className="kpi-label">Volume de plaintes</div>
                    <div className="kpi-value">{stats?.total || 0}</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                    <div className="kpi-icon">✅</div>
                    <div className="kpi-label">Taux de résolution</div>
                    <div className="kpi-value">{stats?.total ? (((stats.byStatus?.['resolue'] || 0) / stats.total) * 100).toFixed(0) : 0}%</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
                    <div className="kpi-icon">⏱️</div>
                    <div className="kpi-label">Plaintes actives</div>
                    <div className="kpi-value">{activeCount}</div>
                </div>
                <div className="kpi-card" style={{ '--kpi-color': 'var(--purple)' } as React.CSSProperties}>
                    <div className="kpi-icon">🌍</div>
                    <div className="kpi-label">Secteurs couverts</div>
                    <div className="kpi-value">{categoryData.length}</div>
                </div>
            </div>

            <div className="cg-21">
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Courbe de tendance (30 jours)</div>
                    </div>
                    <div className="panel-body">
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="_id" stroke="var(--text3)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text3)" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--cream)' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="var(--blue)" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Répartition par catégorie</div>
                    </div>
                    <div className="panel-body">
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {categoryData.slice(0, 4).map((c: any, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text3)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                                    <span style={{ textTransform: 'capitalize' }}>{c.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

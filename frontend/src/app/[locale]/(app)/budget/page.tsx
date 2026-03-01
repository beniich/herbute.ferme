'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { financeApi } from '@/lib/api';

interface Stats {
  month: { revenue: number; expenses: number; profit: number };
  year: { revenue: number; expenses: number; profit: number };
  bySector: { _id: string; revenue: number; expenses: number }[];
}

export default function BudgetPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, kpiRes] = await Promise.all([
        financeApi.getStats() as any,
        financeApi.getKPIs() as any,
      ]);
      setStats(statsRes?.data || null);
      setKpi(kpiRes?.data || null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const fmtK = (n: number) => (n / 1000).toFixed(1);

  return (
    <div className="page active">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--gold)' }}>Module Finance</div>
          <h1 className="page-title">Budget &amp; Tableau de Bord Financier</h1>
          <div className="page-sub">Synthèse annuelle · Calculé automatiquement depuis les transactions</div>
        </div>

        {/* KPIs Annuels */}
        <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '24px' }}>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">📈</div>
            <div className="kpi-label">Chiffre d&apos;Affaires (Année)</div>
            <div className="kpi-value">{loading ? '—' : fmtK(stats?.year.revenue || 0)}<span className="kpi-unit">KDH</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">📉</div>
            <div className="kpi-label">Charges Totales (Année)</div>
            <div className="kpi-value">{loading ? '—' : fmtK(stats?.year.expenses || 0)}<span className="kpi-unit">KDH</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': stats && stats.year.profit >= 0 ? 'var(--green)' : 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">💎</div>
            <div className="kpi-label">Bénéfice Net (Année)</div>
            <div className="kpi-value">{loading ? '—' : fmtK(stats?.year.profit || 0)}<span className="kpi-unit">KDH</span></div>
            {stats && <div className={`kpi-trend ${stats.year.profit >= 0 ? 'up' : 'down'}`}>{stats.year.profit >= 0 ? '▲ Positif' : '▼ Négatif'}</div>}
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🏦</div>
            <div className="kpi-label">Marge Nette</div>
            <div className="kpi-value">
              {loading ? '—' : stats && stats.year.revenue > 0 ? ((stats.year.profit / stats.year.revenue) * 100).toFixed(1) : '0'}
              <span className="kpi-unit">%</span>
            </div>
          </div>
        </div>

        {/* Mois en cours */}
        <div className="content-grid cg-2" style={{ marginBottom: '18px' }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--green)' }}></div>Mois en Cours</div>
            </div>
            <div className="panel-body">
              <div className="fin-row">
                <div className="fin-label">Recettes</div>
                <div className="fin-val fin-rec">+{fmt(stats?.month.revenue || 0)} DH</div>
              </div>
              <div className="fin-row">
                <div className="fin-label">Dépenses</div>
                <div className="fin-val fin-dep">-{fmt(stats?.month.expenses || 0)} DH</div>
              </div>
              <div className="fin-row" style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                <div className="fin-label" style={{ fontWeight: 700, color: 'var(--text)' }}>Solde Net</div>
                <div className="fin-val" style={{ color: stats && stats.month.profit >= 0 ? 'var(--green2)' : '#e87070', fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700 }}>
                  {stats && stats.month.profit >= 0 ? '+' : ''}{fmt(stats?.month.profit || 0)} DH
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--teal)' }}></div>Performance par Secteur</div>
            </div>
            <div className="panel-body">
              {loading ? (
                <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Chargement…</div>
              ) : !stats || stats.bySector.length === 0 ? (
                <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                  Ajoutez des transactions dans Comptabilité pour voir les stats
                </div>
              ) : (
                stats.bySector.map(s => {
                  const profit = s.revenue - s.expenses;
                  const maxVal = Math.max(...stats.bySector.map(x => Math.abs(x.revenue - x.expenses)));
                  const pct = maxVal > 0 ? Math.abs(profit / maxVal) * 100 : 0;
                  return (
                    <div key={s._id} className="mini-bar-row">
                      <div className="mini-bar-info">
                        <div className="mini-bar-name">{s._id}</div>
                        <div className="mini-bar-val" style={{ color: profit >= 0 ? 'var(--green2)' : '#e87070' }}>
                          {profit >= 0 ? '+' : ''}{fmtK(profit)} K DH
                        </div>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${pct}%`, background: profit >= 0 ? 'var(--green2)' : '#e87070' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* CTA vers comptabilité */}
        <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>💡</div>
          <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '12px' }}>
            Pour saisir des transactions, rendez-vous dans le module Comptabilité
          </div>
          <a href="/comptabilite" style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(200,146,26,0.15)', border: '1px solid rgba(200,146,26,0.4)', borderRadius: '8px', color: 'var(--gold2)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            Aller à la Comptabilité →
          </a>
        </div>
      </div>
    </div>
  );
}

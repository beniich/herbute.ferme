'use client';

import React, { useEffect, useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { useOrgStore } from '@/store/orgStore';
import { useDashboardData } from '@/hooks/useDashboardData';

// ─── Types ────────────────────────────────────────────────────────────────
interface KpiCard {
  icon: string; label: string; value: string | number; unit: string;
  trend: string; trendUp: boolean | null; color: string; href: string;
}
interface AlertItem {
  level: 'critical' | 'warning' | 'info'; icon: string;
  text: string; time: string; section: string; href: string;
}

// ─── Sous-composants mémoïsés ─────────────────────────────────────────────
const KpiCardItem = memo(({ kpi }: { kpi: KpiCard }) => (
  <Link href={kpi.href} style={{ textDecoration: 'none' }}>
    <div className="kpi-card" style={{ '--kpi-color': kpi.color } as React.CSSProperties}>
      <div className="kpi-icon">{kpi.icon}</div>
      <div className="kpi-label">{kpi.label}</div>
      <div className="kpi-value">
        {kpi.value}<span className="kpi-unit">{kpi.unit}</span>
      </div>
      <div className={`kpi-trend ${kpi.trendUp === true ? 'up' : kpi.trendUp === false ? 'down' : 'neutral'}`}>
        {kpi.trend}
      </div>
    </div>
  </Link>
));
KpiCardItem.displayName = 'KpiCardItem';

const alertColor = (level: AlertItem['level']) => ({
  critical: 'var(--red)', warning: 'var(--gold2)', info: 'var(--blue)',
}[level]);

// Alertes statiques — à dynamiser via une API /alerts lorsque disponible
const STATIC_ALERTS: AlertItem[] = [
  { level: 'warning', icon: '💉', text: 'Vaccination bovins — Échéance Proche', time: 'Demain', section: 'Élevage', href: '/elevage' },
  { level: 'info', icon: '🚜', text: 'Tracteur JD-8R — Maintenance programmée', time: 'Dans 5 jours', section: 'Équipements', href: '/fleet' },
];

// ─── Page principale ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const { activeOrganization } = useOrgStore();
  const [now, setNow] = useState('');
  const {
    financeStats, animalStats, cropStats, irrigationStats,
    recentTransactions, loading, refresh,
  } = useDashboardData();

  useEffect(() => {
    const d = new Date();
    setNow(d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()));
  }, []);

  // ─── KPIs calculés avec useMemo (évite recalcul à chaque render) ──────
  const kpisFinanciers = useMemo<KpiCard[]>(() => [
    {
      icon: '📈', label: "Chiffre d'Affaires",
      value: loading ? '...' : ((financeStats?.year.revenue ?? 0) / 1_000_000).toFixed(2),
      unit: 'MDH', trend: 'Total Année', trendUp: true, color: 'var(--green)', href: '/comptabilite',
    },
    {
      icon: '📉', label: 'Charges Totales',
      value: loading ? '...' : ((financeStats?.year.expenses ?? 0) / 1000).toFixed(0),
      unit: 'KDH', trend: 'Total Année', trendUp: false, color: 'var(--red)', href: '/budget',
    },
    {
      icon: '💎', label: 'Bénéfice Net',
      value: loading ? '...' : ((financeStats?.year.profit ?? 0) / 1000).toFixed(0),
      unit: 'KDH', trend: 'Total Année', trendUp: (financeStats?.year.profit ?? 0) >= 0,
      color: 'var(--gold)', href: '/reports',
    },
    {
      icon: '🏦', label: 'Trésorerie',
      value: loading ? '...' : ((financeStats?.month.profit ?? 0) / 1000).toFixed(1),
      unit: 'KDH', trend: 'Solde du mois', trendUp: (financeStats?.month.profit ?? 0) >= 0,
      color: 'var(--blue)', href: '/budget',
    },
  ], [financeStats, loading]);

  const kpisOperationnels = useMemo<KpiCard[]>(() => [
    {
      icon: '🐄', label: 'Cheptel Total',
      value: loading ? '...' : (animalStats?.totalAnimals ?? 0),
      unit: 'têtes', trend: 'Échantillon réel', trendUp: true, color: 'var(--amber)', href: '/elevage',
    },
    {
      icon: '🌾', label: 'Cultures Actives',
      value: loading ? '...' : (cropStats?.byStatus?.find(s => s._id === 'GROWING')?.count ?? 0),
      unit: 'lots', trend: 'En croissance', trendUp: true, color: 'var(--green)', href: '/legumes',
    },
    {
      icon: '💧', label: 'Volume Eau',
      value: loading ? '...' : (irrigationStats?.totalVolume ?? 0).toFixed(0),
      unit: 'm³', trend: 'Total irrigation', trendUp: null, color: 'var(--blue)', href: '/irrigation',
    },
    {
      icon: '🌲', label: 'Exploitation',
      value: loading ? '...' : (cropStats?.byCategory?.find(s => s._id === 'FOREST')?.count ?? 0),
      unit: 'lots', trend: 'Forêt active', trendUp: true, color: 'var(--brown)', href: '/foret',
    },
    { icon: '👥', label: 'Effectif', value: '34', unit: 'pers.', trend: '= stable', trendUp: null, color: 'var(--teal)', href: '/hr' },
  ], [animalStats, cropStats, irrigationStats, loading]);

  return (
    <div className="page active" id="page-dashboard">

      {/* PAGE HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <div className="page-label">Vue Générale · {now}</div>
          <h1 className="page-title">{activeOrganization?.name || 'Tableau de Bord'}</h1>
          <div className="page-sub">Toutes activités · Données synchronisées en temps réel</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={refresh}
            style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}
          >
            ↺ Actualiser
          </button>
          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', background: 'rgba(58,122,184,0.12)', border: '1px solid rgba(58,122,184,0.25)', color: 'var(--blue)', cursor: 'pointer', letterSpacing: '1px' }}>
              📈 Analytics
            </button>
          </Link>
        </div>
      </div>

      {/* WEATHER WIDGET */}
      <div className="weather-widget" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', marginBottom: '4px' }}>MÉTÉO FERME</div>
          <div className="weather-main">22°C</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>Ensoleillé · Vent NW 12 km/h</div>
        </div>
        <div className="weather-detail">
          <div>💧 Humidité : <span style={{ color: 'var(--text2)' }}>48%</span></div>
          <div>🌱 Sol : <span style={{ color: 'var(--green2)' }}>Bon état</span></div>
        </div>
        <div className="weather-icon">☀️</div>
      </div>

      {/* KPIs FINANCIERS */}
      <div className="kpi-grid kpi-grid-4">
        {kpisFinanciers.map(kpi => <KpiCardItem key={kpi.label} kpi={kpi} />)}
      </div>

      {/* KPIs OPÉRATIONNELS */}
      <div className="kpi-grid kpi-grid-5" style={{ marginBottom: '22px' }}>
        {kpisOperationnels.map(kpi => <KpiCardItem key={kpi.label} kpi={kpi} />)}
      </div>

      {/* SECTION PRINCIPALE */}
      <div className="content-grid cg-21" style={{ marginBottom: '18px' }}>

        {/* Performance par Secteur */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot"></div>Performance par Secteur</div>
            <Link href="/comptabilite" style={{ textDecoration: 'none' }}>
              <div className="panel-action">Détail →</div>
            </Link>
          </div>
          <div className="panel-body">
            {!financeStats || financeStats.bySector?.length === 0 ? (
              <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Aucune donnée financière</div>
            ) : (
              <div className="content-grid cg-2" style={{ gap: '10px' }}>
                {financeStats.bySector.map(s => {
                  const profit = s.revenue - s.expenses;
                  const max = Math.max(...financeStats.bySector.map(x => Math.abs(x.revenue - x.expenses)));
                  const pct = max > 0 ? (Math.abs(profit) / max) * 100 : 0;
                  return (
                    <div key={s._id} className="mini-bar-row">
                      <div className="mini-bar-info">
                        <span className="mini-bar-name">{s._id}</span>
                        <span className="mini-bar-val">{(profit / 1000).toFixed(1)} KDH</span>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${pct}%`, background: profit >= 0 ? 'var(--green2)' : '#e87070' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Alertes */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot" style={{ background: 'var(--red)' }}></div>Alertes Actives
            </div>
          </div>
          <div className="panel-body" style={{ padding: '12px 20px' }}>
            {STATIC_ALERTS.map((a, i) => (
              <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                <div className="alert-item" style={{ cursor: 'pointer' }}>
                  <div className="alert-dot" style={{ background: alertColor(a.level) }}></div>
                  <div>
                    <div className="alert-text">{a.icon} {a.text}</div>
                    <div className="alert-time">{a.time} · {a.section}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTIONS RÉCENTES */}
      <div className="panel" style={{ paddingBottom: '32px' }}>
        <div className="panel-header">
          <div className="panel-title">
            <div className="dot" style={{ background: 'var(--teal)' }}></div>Transactions Récentes
          </div>
          <Link href="/comptabilite" style={{ textDecoration: 'none' }}>
            <div className="panel-action">Voir tout →</div>
          </Link>
        </div>
        <div className="panel-body" style={{ padding: '0' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Secteur</th><th>Type</th>
                <th style={{ textAlign: 'right' }}>Montant</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(tx => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</td>
                  <td>{tx.description}</td>
                  <td style={{ color: 'var(--text3)', fontSize: '11px' }}>{tx.sector}</td>
                  <td><span className={`pill ${tx.type === 'recette' ? 'pill-green' : 'pill-red'}`}>{tx.type}</span></td>
                  <td style={{ textAlign: 'right', color: tx.type === 'recette' ? 'var(--green2)' : '#e87070', fontFamily: 'var(--font-mono)' }}>
                    {tx.type === 'recette' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

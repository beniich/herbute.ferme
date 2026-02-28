'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface KpiCard {
  icon: string;
  label: string;
  value: string;
  unit: string;
  trend: string;
  trendUp: boolean | null; // null = neutral
  color: string;
  href: string;
}

interface AlertItem {
  level: 'critical' | 'warning' | 'info';
  icon: string;
  text: string;
  time: string;
  section: string;
  href: string;
}

interface Transaction {
  date: string;
  description: string;
  category: string;
  sector: string;
  type: 'Recette' | 'Dépense';
  amount: string;
  color: string;
}

interface Module {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  stat: string;
  statColor: string;
  trend?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const kpisFinanciers: KpiCard[] = [
  {
    icon: '📈',
    label: "Chiffre d'Affaires",
    value: '1,48',
    unit: 'MDH',
    trend: '▲ 14.2% vs 2025',
    trendUp: true,
    color: 'var(--green)',
    href: '/comptabilite',
  },
  {
    icon: '📉',
    label: 'Charges Totales',
    value: '892',
    unit: 'KDH',
    trend: '▲ 4.1% vs 2025',
    trendUp: false,
    color: 'var(--red)',
    href: '/budget',
  },
  {
    icon: '💎',
    label: 'Bénéfice Net',
    value: '588',
    unit: 'KDH',
    trend: '▲ 22.7%',
    trendUp: true,
    color: 'var(--gold)',
    href: '/reports',
  },
  {
    icon: '🏦',
    label: 'Trésorerie',
    value: '284',
    unit: 'KDH',
    trend: '▲ 8.5%',
    trendUp: true,
    color: 'var(--blue)',
    href: '/budget',
  },
];

const kpisOperationnels: KpiCard[] = [
  {
    icon: '🐄',
    label: 'Cheptel Total',
    value: '508',
    unit: 'têtes',
    trend: '▲ 3.2%',
    trendUp: true,
    color: 'var(--amber)',
    href: '/elevage',
  },
  {
    icon: '🐓',
    label: 'Volaille',
    value: '12 400',
    unit: 'unités',
    trend: '▼ 1.2%',
    trendUp: false,
    color: '#e8943a',
    href: '/volaille',
  },
  {
    icon: '🌾',
    label: 'Hectares Cultivés',
    value: '218',
    unit: 'ha',
    trend: '= stable',
    trendUp: null,
    color: 'var(--green)',
    href: '/parcelles',
  },
  {
    icon: '🌲',
    label: 'Surface Forêt',
    value: '82',
    unit: 'ha',
    trend: '▲ Exploitation',
    trendUp: true,
    color: 'var(--brown)',
    href: '/foret',
  },
  {
    icon: '👥',
    label: 'Effectif',
    value: '34',
    unit: 'pers.',
    trend: '= stable',
    trendUp: null,
    color: 'var(--teal)',
    href: '/teams',
  },
];

const alerts: AlertItem[] = [
  {
    level: 'critical',
    icon: '🐓',
    text: 'Mortalité anormale — Lot Poulets B4 (12 unités)',
    time: 'Il y a 2h',
    section: 'Aviculture',
    href: '/volaille',
  },
  {
    level: 'warning',
    icon: '💉',
    text: 'Vaccination bovins — Échéance dans 3 jours',
    time: 'Demain',
    section: 'Élevage',
    href: '/elevage',
  },
  {
    level: 'warning',
    icon: '🌾',
    text: 'Stock aliment bétail — Seuil bas (450 kg restants)',
    time: "Aujourd'hui",
    section: 'Alimentation',
    href: '/inventory',
  },
  {
    level: 'info',
    icon: '🚜',
    text: 'Tracteur JD-8R — Maintenance programmée',
    time: 'Dans 5 jours',
    section: 'Équipements',
    href: '/fleet',
  },
];

const transactions: Transaction[] = [
  { date: '24/02', description: 'Vente lait — Coopérative Atlas', category: 'Ventes', sector: 'Élevage', type: 'Recette', amount: '+24 800 DH', color: 'var(--green2)' },
  { date: '23/02', description: 'Vente poulets chair — Grossiste', category: 'Ventes', sector: 'Aviculture', type: 'Recette', amount: '+18 400 DH', color: 'var(--green2)' },
  { date: '23/02', description: 'Aliment volaille — Fournisseur', category: 'Intrants', sector: 'Aviculture', type: 'Dépense', amount: '−8 200 DH', color: '#e87070' },
  { date: '22/02', description: 'Herbes séchées — Export Europe', category: 'Export', sector: 'Herbes', type: 'Recette', amount: '+12 600 DH', color: 'var(--green2)' },
  { date: '22/02', description: 'Produits vétérinaires bovins', category: 'Santé', sector: 'Élevage', type: 'Dépense', amount: '−3 400 DH', color: '#e87070' },
  { date: '21/02', description: 'Vente bois forêt parcelle F3', category: 'Forestier', sector: 'Forêt', type: 'Recette', amount: '+9 800 DH', color: '#c8926a' },
  { date: '21/02', description: 'Carburant tracteurs & matériel', category: 'Charges', sector: 'Général', type: 'Dépense', amount: '−2 800 DH', color: '#e87070' },
  { date: '20/02', description: 'Vente tomates — Marché Rabat', category: 'Ventes', sector: 'Légumes', type: 'Recette', amount: '+4 200 DH', color: 'var(--green2)' },
];

const modules: Module[] = [
  { href: '/elevage', icon: '🐄', title: 'Élevage', subtitle: 'Bovin & Ovin', stat: '508 têtes', statColor: 'var(--amber)', trend: '▲ 3.2%' },
  { href: '/volaille', icon: '🐓', title: 'Aviculture', subtitle: 'Poulets & Œufs', stat: '12 400 unités', statColor: '#e8943a', trend: '▼ 1.2%' },
  { href: '/herbes', icon: '🌿', title: 'Herbes', subtitle: 'Aromates & Export', stat: '210K DH/mois', statColor: 'var(--green)', trend: '▲ 8%' },
  { href: '/legumes', icon: '🥕', title: 'Légumes', subtitle: 'Cultures locales', stat: '48 ha', statColor: '#7bc67e', trend: '= stable' },
  { href: '/foret', icon: '🌲', title: 'Forêt', subtitle: 'Exploitation bois', stat: '82 ha', statColor: 'var(--brown)', trend: '▲ Actif' },
  { href: '/pepiniere', icon: '🪴', title: 'Pépinière', subtitle: 'Plants & semis', stat: '4 200 plants', statColor: 'var(--teal)', trend: '= Saison' },
  { href: '/parcelles', icon: '🗺️', title: 'Parcelles', subtitle: 'Cartographie', stat: '218 ha', statColor: 'var(--green)', trend: '= 26 parcelles' },
  { href: '/irrigation', icon: '💧', title: 'Irrigation', subtitle: 'Eau & réseau', stat: '68%', statColor: 'var(--blue)', trend: '▼ 4%' },
  { href: '/fleet', icon: '🚜', title: 'Flotte', subtitle: 'Engins & véhicules', stat: '12 engins', statColor: 'var(--gold)', trend: '1 en maint.' },
  { href: '/inventory', icon: '📦', title: 'Inventaire', subtitle: 'Stocks & intrants', stat: '94%', statColor: 'var(--green2)', trend: '⚠ 2 seuils' },
  { href: '/planning', icon: '📅', title: 'Planning', subtitle: 'Récoltes & travaux', stat: '8 tâches', statColor: 'var(--purple)', trend: 'Cette semaine' },
  { href: '/reports', icon: '📋', title: 'Rapports', subtitle: 'Export & analyse', stat: '14 rapports', statColor: 'var(--teal)', trend: 'Fév. 2026' },
];

const barMonths = [
  { m: 'J', h: 60, bg: 'var(--amber)' },
  { m: 'F', h: 72, bg: 'var(--amber)' },
  { m: 'M', h: 55, bg: 'var(--green)' },
  { m: 'A', h: 85, bg: 'var(--green2)' },
  { m: 'M', h: 92, bg: 'var(--green2)' },
  { m: 'J', h: 100, bg: 'var(--gold)' },
  { m: 'J', h: 88, bg: 'var(--gold)' },
  { m: 'A', h: 78, bg: 'var(--amber)' },
  { m: 'S', h: 68, bg: 'var(--amber)' },
  { m: 'O', h: 75, bg: 'var(--green)' },
  { m: 'N', h: 82, bg: 'var(--green)' },
  { m: 'D', h: 90, bg: 'var(--green2)' },
];

const revenueBySection = [
  { name: '🐄 Élevage bovin', val: '480K DH', pct: 81, bg: 'var(--amber)' },
  { name: '🐓 Aviculture', val: '320K DH', pct: 54, bg: '#e8943a' },
  { name: '🌿 Herbes export', val: '210K DH', pct: 35, bg: 'var(--green)' },
  { name: '🥕 Légumes', val: '180K DH', pct: 30, bg: '#7bc67e' },
  { name: '🌲 Forêt (bois)', val: '140K DH', pct: 24, bg: 'var(--brown)' },
  { name: '🪴 Pépinière', val: '80K DH', pct: 13, bg: 'var(--teal)' },
  { name: '🥚 Œufs', val: '68K DH', pct: 12, bg: 'var(--gold)' },
  { name: '🫙 Transformation', val: '2K DH', pct: 0.3, bg: 'var(--blue)' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [now, setNow] = useState('');

  useEffect(() => {
    const d = new Date();
    setNow(
      d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        .replace(/^\w/, (c) => c.toUpperCase())
    );
  }, []);

  const alertColor = (level: AlertItem['level']) => {
    if (level === 'critical') return 'var(--red)';
    if (level === 'warning') return 'var(--gold2)';
    return 'var(--blue)';
  };

  return (
    <div className="page active" id="page-dashboard">
      <div style={{ padding: '24px 24px 0' }}>

        {/* ── PAGE HEADER ── */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <div className="page-label">Vue Générale · {now}</div>
            <h1 className="page-title">Domaine Al Baraka</h1>
            <div className="page-sub">Toutes activités confondues · Rabat-Salé-Kénitra, Maroc</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/reports" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', background: 'rgba(90,158,69,0.12)', border: '1px solid rgba(90,158,69,0.25)', color: 'var(--green2)', cursor: 'pointer', letterSpacing: '1px' }}>
                📊 Rapports
              </button>
            </Link>
            <Link href="/analytics" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', background: 'rgba(58,122,184,0.12)', border: '1px solid rgba(58,122,184,0.25)', color: 'var(--blue)', cursor: 'pointer', letterSpacing: '1px' }}>
                📈 Analytics
              </button>
            </Link>
          </div>
        </div>

        {/* ── WEATHER WIDGET ── */}
        <div className="weather-widget" style={{ marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', marginBottom: '4px' }}>
              MÉTÉO FERME · AUJOURD&apos;HUI
            </div>
            <div className="weather-main">22°C</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>
              Ensoleillé · Vent NW 12 km/h
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div className="weather-detail">
              <div>💧 Humidité : <span style={{ color: 'var(--text2)' }}>48%</span></div>
              <div>🌧️ Pluie : <span style={{ color: 'var(--text2)' }}>Jeudi prochain</span></div>
              <div>🌡️ Min/Max : <span style={{ color: 'var(--text2)' }}>14° / 26°</span></div>
            </div>
            <div className="weather-detail">
              <div>🌱 Sol : <span style={{ color: 'var(--green2)' }}>Bon état</span></div>
              <div>💨 UV : <span style={{ color: 'var(--gold2)' }}>Élevé (7)</span></div>
              <div>🔮 Prévision : <span style={{ color: 'var(--text2)' }}>5 jours favorables</span></div>
            </div>
          </div>
          <Link href="/meteo" style={{ textDecoration: 'none' }}>
            <div className="weather-icon" title="Voir météo détaillée" style={{ cursor: 'pointer' }}>☀️</div>
          </Link>
        </div>

        {/* ── KPIs FINANCIERS ── */}
        <div className="kpi-grid kpi-grid-4">
          {kpisFinanciers.map((kpi) => (
            <Link key={kpi.label} href={kpi.href} style={{ textDecoration: 'none' }}>
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
          ))}
        </div>

        {/* ── KPIs OPÉRATIONNELS ── */}
        <div className="kpi-grid kpi-grid-5" style={{ marginBottom: '22px' }}>
          {kpisOperationnels.map((kpi) => (
            <Link key={kpi.label} href={kpi.href} style={{ textDecoration: 'none' }}>
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
          ))}
        </div>

        {/* ── SECTION PRINCIPALE: REVENUS + ALERTES + BUDGET ── */}
        <div className="content-grid cg-21" style={{ marginBottom: '18px' }}>
          {/* REVENUS PAR SECTEUR */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot"></div>Revenus par Secteur · 2026
              </div>
              <Link href="/comptabilite" style={{ textDecoration: 'none' }}>
                <div className="panel-action">Détail →</div>
              </Link>
            </div>
            <div className="panel-body">
              <div className="content-grid cg-2" style={{ gap: '10px', marginBottom: '16px' }}>
                <div>
                  {revenueBySection.slice(0, 4).map((r) => (
                    <div key={r.name} className="mini-bar-row">
                      <div className="mini-bar-info">
                        <span className="mini-bar-name">{r.name}</span>
                        <span className="mini-bar-val">{r.val}</span>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${r.pct}%`, background: r.bg }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {revenueBySection.slice(4).map((r) => (
                    <div key={r.name} className="mini-bar-row">
                      <div className="mini-bar-info">
                        <span className="mini-bar-name">{r.name}</span>
                        <span className="mini-bar-val">{r.val}</span>
                      </div>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${r.pct}%`, background: r.bg }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bar chart mensuel */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>
                {barMonths.map((b, i) => (
                  <div key={i} className="bar-wrap">
                    <div className="bar" style={{ height: `${b.h}%`, background: b.bg }}></div>
                    <span className="bar-label">{b.m}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', textAlign: 'center' }}>
                Évolution mensuelle des revenus 2026
              </div>
            </div>
          </div>

          {/* ALERTES + BUDGET */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Alertes */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="dot" style={{ background: 'var(--red)' }}></div>
                  Alertes Actives
                  <span style={{ marginLeft: '4px', padding: '1px 6px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'rgba(192,57,43,0.2)', color: 'var(--red)' }}>
                    {alerts.length}
                  </span>
                </div>
                <Link href="/complaints" style={{ textDecoration: 'none' }}>
                  <div className="panel-action">Tout voir</div>
                </Link>
              </div>
              <div className="panel-body" style={{ padding: '12px 20px' }}>
                {alerts.map((a, i) => (
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

            {/* Budget */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="dot" style={{ background: 'var(--blue)' }}></div>
                  Budget Annuel 2026
                </div>
                <Link href="/budget" style={{ textDecoration: 'none' }}>
                  <div className="panel-action">Détail →</div>
                </Link>
              </div>
              <div className="panel-body">
                <div className="gauge-row">
                  <div className="gauge-label">Revenus</div>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: '16.4%', background: 'var(--green)' }}></div>
                  </div>
                  <div className="gauge-val" style={{ color: 'var(--green2)' }}>16.4%</div>
                </div>
                <div className="gauge-row">
                  <div className="gauge-label">Charges</div>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: '17.2%', background: 'var(--red)' }}></div>
                  </div>
                  <div className="gauge-val" style={{ color: '#e87070' }}>17.2%</div>
                </div>
                <div className="gauge-row">
                  <div className="gauge-label">Investissements</div>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: '22%', background: 'var(--blue)' }}></div>
                  </div>
                  <div className="gauge-val" style={{ color: 'var(--blue)' }}>22%</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', marginTop: '8px' }}>
                  Avancement sur objectifs annuels 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODULES RAPIDES ── */}
        <div className="panel" style={{ marginBottom: '18px' }}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot" style={{ background: 'var(--purple)' }}></div>
              Accès Rapide · Modules
            </div>
          </div>
          <div className="panel-body" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {modules.map((mod) => (
                <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
                  <div
                    className="module-quick-card"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)';
                    }}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>{mod.icon}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600, marginBottom: '2px' }}>{mod.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', marginBottom: '8px' }}>{mod.subtitle}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: mod.statColor, fontWeight: 700 }}>{mod.stat}</div>
                    {mod.trend && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>{mod.trend}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── TRANSACTIONS RÉCENTES ── */}
        <div className="panel" style={{ marginTop: '0', paddingBottom: '32px' }}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot" style={{ background: 'var(--teal)' }}></div>
              Dernières Transactions
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/reports" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(90,158,69,0.12)', border: '1px solid rgba(90,158,69,0.25)', color: 'var(--green2)', cursor: 'pointer' }}>
                  📊 Excel
                </button>
              </Link>
              <Link href="/reports" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(138,82,184,0.12)', border: '1px solid rgba(138,82,184,0.25)', color: '#b87cb8', cursor: 'pointer' }}>
                  📄 PDF
                </button>
              </Link>
              <Link href="/comptabilite" style={{ textDecoration: 'none' }}>
                <div className="panel-action">Voir tout →</div>
              </Link>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Secteur</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td>{tx.category}</td>
                    <td>{tx.sector}</td>
                    <td>
                      <span className={`pill ${tx.type === 'Recette' ? 'pill-green' : 'pill-red'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: tx.color, fontFamily: 'var(--font-mono)' }}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

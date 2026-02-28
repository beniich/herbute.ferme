'use client';

import React from 'react';

export default function AgroDashboardPage() {
  return (
    <div className="page active" id="page-dashboard">
      <div style={{ padding: '24px 24px 0' }}>
        <div className="page-header">
          <div className="page-label">Vue Générale · Février 2026</div>
          <h1 className="page-title">Domaine Al Baraka</h1>
          <div className="page-sub">Toutes activités confondues · Rabat-Salé-Kénitra, Maroc</div>
        </div>

        {/* WEATHER QUICK */}
        <div className="weather-widget">
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', marginBottom: '4px' }}>MÉTÉO FERME · AUJOURD'HUI</div>
            <div className="weather-main">22°C</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>Ensoleillé · Vent NW 12 km/h</div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
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
          <div className="weather-icon">☀️</div>
        </div>

        {/* KPIs FINANCIERS */}
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">📈</div>
            <div className="kpi-label">Chiffre d'Affaires</div>
            <div id="agro-revenue" className="kpi-value">1,48<span className="kpi-unit">MDH</span></div>
            <div className="kpi-trend up">▲ 14.2% vs 2025</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">📉</div>
            <div className="kpi-label">Charges Totales</div>
            <div id="agro-expenses" className="kpi-value">892<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend down">▲ 4.1% vs 2025</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">💎</div>
            <div className="kpi-label">Bénéfice Net</div>
            <div id="agro-profit" className="kpi-value">588<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 22.7%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🏦</div>
            <div className="kpi-label">Trésorerie</div>
            <div id="agro-cash" className="kpi-value">284<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 8.5%</div>
          </div>
        </div>

        {/* KPIs OPERATIONNELS */}
        <div className="kpi-grid kpi-grid-5" style={{ marginBottom: '22px' }}>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--amber)' } as React.CSSProperties}>
            <div className="kpi-icon">🐄</div>
            <div className="kpi-label">Cheptel Total</div>
            <div id="agro-animals" className="kpi-value">508<span className="kpi-unit">têtes</span></div>
            <div className="kpi-trend up">▲ 3.2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': '#e8943a' } as React.CSSProperties}>
            <div className="kpi-icon">🐓</div>
            <div className="kpi-label">Volaille</div>
            <div id="agro-poultry" className="kpi-value">12 400<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend down">▼ 1.2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🌾</div>
            <div className="kpi-label">Hectares Cultivés</div>
            <div id="agro-ha" className="kpi-value">218<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend neutral">= stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--brown)' } as React.CSSProperties}>
            <div className="kpi-icon">🌲</div>
            <div className="kpi-label">Surface Forêt</div>
            <div className="kpi-value">82<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend up">▲ Exploitation</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">👥</div>
            <div className="kpi-label">Effectif</div>
            <div className="kpi-value">34<span className="kpi-unit">pers.</span></div>
            <div className="kpi-trend neutral">= stable</div>
          </div>
        </div>

        <div className="content-grid cg-21">
          {/* REVENUS PAR SECTEUR */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot"></div>Revenus par Secteur · 2026</div>
              <div className="panel-action">Détail →</div>
            </div>
            <div className="panel-body">
              <div className="content-grid cg-2" style={{ gap: '10px', marginBottom: '16px' }}>
                <div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🐄 Élevage bovin</span><span className="mini-bar-val">480K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '81%', background: 'var(--amber)' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🐓 Aviculture</span><span className="mini-bar-val">320K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '54%', background: '#e8943a' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🌿 Herbes export</span><span className="mini-bar-val">210K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '35%', background: 'var(--green)' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🥕 Légumes</span><span className="mini-bar-val">180K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '30%', background: '#7bc67e' }}></div></div>
                  </div>
                </div>
                <div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🌲 Forêt (bois)</span><span className="mini-bar-val">140K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '24%', background: 'var(--brown)' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🪴 Pépinière</span><span className="mini-bar-val">80K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '13%', background: 'var(--teal)' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🥚 Œufs</span><span className="mini-bar-val">68K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '12%', background: 'var(--gold)' }}></div></div>
                  </div>
                  <div className="mini-bar-row">
                    <div className="mini-bar-info"><span className="mini-bar-name">🫙 Transformation</span><span className="mini-bar-val">2K DH</span></div>
                    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '0.3%', background: 'var(--blue)' }}></div></div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>
                <div className="bar-wrap"><div className="bar" style={{ height: '60%', background: 'var(--amber)' }}></div><span className="bar-label">J</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '72%', background: 'var(--amber)' }}></div><span className="bar-label">F</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '55%', background: 'var(--green)' }}></div><span className="bar-label">M</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '85%', background: 'var(--green2)' }}></div><span className="bar-label">A</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '92%', background: 'var(--green2)' }}></div><span className="bar-label">M</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '100%', background: 'var(--gold)' }}></div><span className="bar-label">J</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '88%', background: 'var(--gold)' }}></div><span className="bar-label">J</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '78%', background: 'var(--amber)' }}></div><span className="bar-label">A</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '68%', background: 'var(--amber)' }}></div><span className="bar-label">S</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '75%', background: 'var(--green)' }}></div><span className="bar-label">O</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '82%', background: 'var(--green)' }}></div><span className="bar-label">N</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '90%', background: 'var(--green2)' }}></div><span className="bar-label">D</span></div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', textAlign: 'center' }}>Évolution mensuelle des revenus 2026</div>
            </div>
          </div>

          {/* ALERTES + BUDGET */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title"><div className="dot" style={{ background: 'var(--red)' }}></div>Alertes Actives</div>
                <div className="panel-action">Tout voir</div>
              </div>
              <div className="panel-body" style={{ padding: '12px 20px' }}>
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--red)' }}></div>
                  <div>
                    <div className="alert-text">🐓 Mortalité anormale — Lot Poulets B4 (12 unités)</div>
                    <div className="alert-time">Il y a 2h · Aviculture</div>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--gold)' }}></div>
                  <div>
                    <div className="alert-text">💉 Vaccination bovins — Échéance dans 3 jours</div>
                    <div className="alert-time">Demain · Élevage</div>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--gold)' }}></div>
                  <div>
                    <div className="alert-text">🌾 Stock aliment bétail — Seuil bas (450 kg restants)</div>
                    <div className="alert-time">Aujourd'hui · Alimentation</div>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--blue)' }}></div>
                  <div>
                    <div className="alert-text">🚜 Tracteur JD-8R — Maintenance programmée</div>
                    <div className="alert-time">Dans 5 jours · Équipements</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Budget Annuel</div>
              </div>
              <div className="panel-body">
                <div className="gauge-row">
                  <div className="gauge-label">Revenus</div>
                  <div className="gauge-track"><div className="gauge-fill" style={{ width: '16.4%', background: 'var(--green)' }}></div></div>
                  <div className="gauge-val" style={{ color: 'var(--green2)' }}>16.4%</div>
                </div>
                <div className="gauge-row">
                  <div className="gauge-label">Charges</div>
                  <div className="gauge-track"><div className="gauge-fill" style={{ width: '17.2%', background: 'var(--red)' }}></div></div>
                  <div className="gauge-val" style={{ color: '#e87070' }}>17.2%</div>
                </div>
                <div className="gauge-row">
                  <div className="gauge-label">Investissements</div>
                  <div className="gauge-track"><div className="gauge-fill" style={{ width: '22%', background: 'var(--blue)' }}></div></div>
                  <div className="gauge-val" style={{ color: 'var(--blue)' }}>22%</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', marginTop: '8px' }}>Avancement sur objectifs annuels 2026</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* TRANSACTIONS RÉCENTES */}
        <div className="panel" style={{ marginTop: '0', paddingBottom: '32px' }}>
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--teal)' }}></div>Dernières Transactions</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(90,158,69,0.12)', border: '1px solid rgba(90,158,69,0.25)', color: 'var(--green2)', cursor: 'pointer' }}>📊 Excel</button>
              <button style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'rgba(138,82,184,0.12)', border: '1px solid rgba(138,82,184,0.25)', color: '#b87cb8', cursor: 'pointer' }}>📄 PDF</button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead><tr>
                <th>Date</th><th>Description</th><th>Catégorie</th><th>Secteur</th><th>Type</th><th style={{ textAlign: 'right' }}>Montant</th>
              </tr></thead>
              <tbody>
                <tr><td>24/02</td><td>Vente lait — Coopérative Atlas</td><td>Ventes</td><td>Élevage</td><td><span className="pill pill-green">Recette</span></td><td style={{ textAlign: 'right', color: 'var(--green2)', fontFamily: 'var(--font-mono)' }}>+24 800 DH</td></tr>
                <tr><td>23/02</td><td>Vente poulets chair — Grossiste</td><td>Ventes</td><td>Aviculture</td><td><span className="pill pill-green">Recette</span></td><td style={{ textAlign: 'right', color: 'var(--green2)', fontFamily: 'var(--font-mono)' }}>+18 400 DH</td></tr>
                <tr><td>23/02</td><td>Aliment volaille — Fournisseur</td><td>Intrants</td><td>Aviculture</td><td><span className="pill pill-red">Dépense</span></td><td style={{ textAlign: 'right', color: '#e87070', fontFamily: 'var(--font-mono)' }}>−8 200 DH</td></tr>
                <tr><td>22/02</td><td>Herbes séchées — Export Europe</td><td>Export</td><td>Herbes</td><td><span className="pill pill-green">Recette</span></td><td style={{ textAlign: 'right', color: 'var(--green2)', fontFamily: 'var(--font-mono)' }}>+12 600 DH</td></tr>
                <tr><td>22/02</td><td>Produits vétérinaires bovins</td><td>Santé</td><td>Élevage</td><td><span className="pill pill-red">Dépense</span></td><td style={{ textAlign: 'right', color: '#e87070', fontFamily: 'var(--font-mono)' }}>−3 400 DH</td></tr>
                <tr><td>21/02</td><td>Vente bois forêt parcelle F3</td><td>Forestier</td><td>Forêt</td><td><span className="pill pill-brown">Recette</span></td><td style={{ textAlign: 'right', color: '#c8926a', fontFamily: 'var(--font-mono)' }}>+9 800 DH</td></tr>
                <tr><td>21/02</td><td>Carburant tracteurs & matériel</td><td>Charges</td><td>Général</td><td><span className="pill pill-red">Dépense</span></td><td style={{ textAlign: 'right', color: '#e87070', fontFamily: 'var(--font-mono)' }}>−2 800 DH</td></tr>
                <tr><td>20/02</td><td>Vente tomates — Marché Rabat</td><td>Ventes</td><td>Légumes</td><td><span className="pill pill-green">Recette</span></td><td style={{ textAlign: 'right', color: 'var(--green2)', fontFamily: 'var(--font-mono)' }}>+4 200 DH</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

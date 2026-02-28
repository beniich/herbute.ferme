'use client';

import React from 'react';

export default function DomainePage() {
  return (
    <div className="page active" id="page-domaine">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--teal)' }}>Domaine & Infrastructure</div>
          <h1 className="page-title">Gestion du Domaine Agricole · 340 ha</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">🏡</div>
            <div className="kpi-label">Surface Totale</div>
            <div className="kpi-value">340<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend neutral">= stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🌾</div>
            <div className="kpi-label">Terres Cultivées</div>
            <div className="kpi-value">218<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend up">64.1%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--brown)' } as React.CSSProperties}>
            <div className="kpi-icon">🌲</div>
            <div className="kpi-label">Zone Forestière</div>
            <div className="kpi-value">82<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend neutral">24.1%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🏗️</div>
            <div className="kpi-label">Bâti & Infrastructure</div>
            <div className="kpi-value">40<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend neutral">11.8%</div>
          </div>
        </div>
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--teal)' }}></div>Répartition du Domaine</div>
            </div>
            <div className="panel-body">
              <div style={{ marginBottom: '16px' }}>
                <div className="gauge-row"><div className="gauge-label">🌾 Cultures</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '64%', background: 'var(--green)' }}></div></div><div className="gauge-val">218 ha</div></div>
                <div className="gauge-row"><div className="gauge-label">🌲 Forêt</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '24%', background: 'var(--brown)' }}></div></div><div className="gauge-val">82 ha</div></div>
                <div className="gauge-row"><div className="gauge-label">🐄 Pâturages</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '8%', background: 'var(--amber)' }}></div></div><div className="gauge-val">28 ha</div></div>
                <div className="gauge-row"><div className="gauge-label">🏗️ Bâtiments</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '5%', background: 'var(--blue)' }}></div></div><div className="gauge-val">18 ha</div></div>
                <div className="gauge-row"><div className="gauge-label">💧 Bassins/Canaux</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '3%', background: 'var(--teal)' }}></div></div><div className="gauge-val">8 ha</div></div>
                <div className="gauge-row"><div className="gauge-label">🛤️ Chemins/Accès</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '2%', background: 'var(--text3)' }}></div></div><div className="gauge-val">6 ha</div></div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Bâtiments & Infrastructure</div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bâtiment</th>
                    <th>Surface</th>
                    <th>État</th>
                    <th>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>🏠 Maison principale</td><td>280 m²</td><td><span className="pill pill-green">Bon</span></td><td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>900K DH</td></tr>
                  <tr><td>🐄 Étable bovins</td><td>1 200 m²</td><td><span className="pill pill-green">Bon</span></td><td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>480K DH</td></tr>
                  <tr><td>🐓 Poulailler A</td><td>2 000 m²</td><td><span className="pill pill-gold">Rénov.</span></td><td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>320K DH</td></tr>
                  <tr><td>🐓 Poulailler B</td><td>1 800 m²</td><td><span className="pill pill-green">Bon</span></td><td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>280K DH</td></tr>
                  <tr><td>🏭 Hangar matériel</td><td>600 m²</td><td><span className="pill pill-green">Bon</span></td><td style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>180K DH</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

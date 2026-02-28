'use client';

import React from 'react';

export default function HerbesPage() {
  return (
    <div className="page active" id="page-herbes">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--green)' }}>Plantes Aromatiques</div>
          <h1 className="page-title">Herbes & Aromates</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🌿</div>
            <div className="kpi-label">Production Menthe</div>
            <div className="kpi-value">1 240<span className="kpi-unit">kg/mois</span></div>
            <div className="kpi-trend up">▲ 12%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green2)' } as React.CSSProperties}>
            <div className="kpi-icon">🍃</div>
            <div className="kpi-label">Nb Variétés</div>
            <div className="kpi-value">12<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend neutral">Stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">📦</div>
            <div className="kpi-label">Export Europe</div>
            <div className="kpi-value">840<span className="kpi-unit">kg</span></div>
            <div className="kpi-trend up">▲ 22%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">💹</div>
            <div className="kpi-label">C.A. Estimé</div>
            <div className="kpi-value">210<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 5%</div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Lots en cours de récolte</div></div>
          <div className="panel-body" style={{ padding: 0 }}>
             <table className="data-table">
              <thead><tr><th>Plante</th><th>Lot</th><th>Qualité</th><th>Poids</th><th>Statut</th></tr></thead>
              <tbody>
                <tr><td>Menthe Poivrée</td><td>M-01</td><td>AA+ (Export)</td><td>420 kg</td><td><span className="pill pill-green">Séchage</span></td></tr>
                <tr><td>Absinthe</td><td>A-03</td><td>Bio</td><td>180 kg</td><td><span className="pill pill-green">Conditionnement</span></td></tr>
                <tr><td>Verveine</td><td>V-02</td><td>Standard</td><td>320 kg</td><td><span className="pill pill-gold">Récolte</span></td></tr>
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

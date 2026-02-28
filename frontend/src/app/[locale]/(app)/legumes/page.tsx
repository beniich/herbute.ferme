'use client';

import React from 'react';

export default function LegumesPage() {
  return (
    <div className="page active" id="page-legumes">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--amber)' }}>Maraîchage</div>
          <h1 className="page-title">Légumes & Fruits</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--amber)' } as React.CSSProperties}>
            <div className="kpi-icon">🥕</div>
            <div className="kpi-label">Racines</div>
            <div className="kpi-value">4.2<span className="kpi-unit">tonnes</span></div>
            <div className="kpi-trend up">En stock</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green2)' } as React.CSSProperties}>
            <div className="kpi-icon">🍅</div>
            <div className="kpi-label">Fruits Legumes</div>
            <div className="kpi-value">2.8<span className="kpi-unit">tonnes</span></div>
            <div className="kpi-trend up">En récolte</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">❄️</div>
            <div className="kpi-label">Invendus / Perte</div>
            <div className="kpi-value">2.4<span className="kpi-unit">%</span></div>
            <div className="kpi-trend down">Optimisé</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🥬</div>
            <div className="kpi-label">Feuilles</div>
            <div className="kpi-value">1.1<span className="kpi-unit">tonnes</span></div>
            <div className="kpi-trend up">▲ 14%</div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Production maraîchère détaillée</div></div>
          <div className="panel-body" style={{ padding: 0 }}>
             <table className="data-table">
              <thead><tr><th>Produit</th><th>Parcelle</th><th>Poids Récolté</th><th>Marché</th><th>Prix Moy.</th></tr></thead>
              <tbody>
                <tr><td>Carottes</td><td>P04</td><td>1 200 kg</td><td>Casablanca</td><td>4.5 DH/kg</td></tr>
                <tr><td>Tomates Cerise</td><td>P06</td><td>450 kg</td><td>Rabat (Marché)</td><td>12.0 DH/kg</td></tr>
                <tr><td>Oignons Jaunes</td><td>P07</td><td>2 800 kg</td><td>Grossistes</td><td>3.2 DH/kg</td></tr>
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

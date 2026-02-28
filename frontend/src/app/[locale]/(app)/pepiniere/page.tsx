'use client';

import React from 'react';

export default function PepinierePage() {
  return (
    <div className="page active" id="page-pepiniere">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--teal)' }}>Espace Pépinière</div>
          <h1 className="page-title">Pépinière & Horticulture</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">🪴</div>
            <div className="kpi-label">Plantes en Stock</div>
            <div className="kpi-value">12 800<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend up">▲ 8%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green2)' } as React.CSSProperties}>
            <div className="kpi-icon">🌱</div>
            <div className="kpi-label">Nb Espèces</div>
            <div className="kpi-value">42<span className="kpi-unit">variétés</span></div>
            <div className="kpi-trend neutral">Stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">💰</div>
            <div className="kpi-label">Valeur Stock</div>
            <div className="kpi-value">185<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 12%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🚚</div>
            <div className="kpi-label">Ventes (30j)</div>
            <div className="kpi-value">42<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 15%</div>
          </div>
        </div>
        
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--teal)' }}></div>Catalogue & Stock Actuel</div>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Espèce</th>
                  <th>Variété</th>
                  <th>Âge / Stade</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>🌲 Olivier</td><td>Picholine</td><td>2 ans (Greffé)</td><td>2 400</td><td>45 DH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>108 000 DH</td></tr>
                <tr><td>🌳 Citronnier</td><td>Eureka</td><td>1 an</td><td>800</td><td>35 DH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>28 000 DH</td></tr>
                <tr><td>🍊 Oranger</td><td>Maroc Late</td><td>1.5 an</td><td>1 200</td><td>32 DH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>38 400 DH</td></tr>
                <tr><td>🪴 Plantes Ornem.</td><td>Divers</td><td>—</td><td>3 200</td><td>15 DH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>48 000 DH</td></tr>
                <tr><td>🌿 Médicinales</td><td>Divers</td><td>Semis</td><td>5 200</td><td>8 DH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>41 600 DH</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

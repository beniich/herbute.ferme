'use client';

import React from 'react';

export default function ForetPage() {
  return (
    <div className="page active" id="page-foret">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--brown)' }}>Module Forestier</div>
          <h1 className="page-title">Gestion & Exploitation Forestière</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--brown)' } as React.CSSProperties}>
            <div className="kpi-icon">🌲</div>
            <div className="kpi-label">Surface Boisée</div>
            <div className="kpi-value">82<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend neutral">= stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🌳</div>
            <div className="kpi-label">Nb Arbres Est.</div>
            <div className="kpi-value">12 400<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend up">▲ 1.4% (reboisement)</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🪵</div>
            <div className="kpi-label">Prod. Bois / An</div>
            <div className="kpi-value">240<span className="kpi-unit">m³</span></div>
            <div className="kpi-trend neutral">Quota respecté</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">💧</div>
            <div className="kpi-label">Capture Carbone</div>
            <div className="kpi-value">184<span className="kpi-unit">tCO2/an</span></div>
            <div className="kpi-trend up">▲ Impact Positif</div>
          </div>
        </div>
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--brown)' }}></div>Espèces & Parcelles Forêt</div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Espèce</th>
                    <th>Parcelle</th>
                    <th>Surface</th>
                    <th>Âge Moy.</th>
                    <th>Proch. Coupe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>🌲 Eucalyptus</td><td>F1, F2</td><td>44 ha</td><td>12 ans</td><td><span className="pill pill-green">2027</span></td></tr>
                  <tr><td>🌳 Chêne Liège</td><td>F3</td><td>28 ha</td><td>45 ans</td><td><span className="pill pill-teal">Récolte Liège</span></td></tr>
                  <tr><td>🌿 Pins / Mixte</td><td>F4, F5</td><td>10 ha</td><td>8 ans</td><td><span className="pill pill-gold">2034</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Statistiques Forestières</div>
            </div>
            <div className="panel-body">
              <div className="compact-row"><div className="cr-name">🍄 Sous-bois (PFNL)</div><div><div className="cr-val">Champignons, Miel</div><div className="cr-sub">Valorisation possible</div></div></div>
              <div className="compact-row"><div className="cr-name">💧 Bilan carbone</div><div><div className="cr-val" style={{ color: 'var(--green2)' }}>+184 tCO2/an</div><div className="cr-sub">Séquestration forêt</div></div></div>
              <div className="compact-row"><div className="cr-name">📋 Permis coupe</div><div><div className="cr-val" style={{ color: 'var(--blue)' }}>En cours</div><div className="cr-sub">Eaux & Forêts</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

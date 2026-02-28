'use client';

import React from 'react';

export default function VolaillePage() {
  return (
    <div className="page active" id="page-volaille">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: '#e8943a' }}>Ferme Avicole</div>
          <h1 className="page-title">Gestion de la Volaille</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': '#e8943a' } as React.CSSProperties}>
            <div className="kpi-icon">🐔</div>
            <div className="kpi-label">Poules Pondeuses</div>
            <div className="kpi-value">4 800<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend up">▲ 2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': '#e8943a' } as React.CSSProperties}>
            <div className="kpi-icon">🐓</div>
            <div className="kpi-label">Poulets Chair</div>
            <div className="kpi-value">6 200<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend down">▼ 3%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🥚</div>
            <div className="kpi-label">Œufs / Jour</div>
            <div className="kpi-value">4 320<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend up">▲ 5.2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">💀</div>
            <div className="kpi-label">Mortalité</div>
            <div className="kpi-value">0.8<span className="kpi-unit">%</span></div>
            <div className="kpi-trend down">▼ Attention !</div>
          </div>
        </div>
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: '#e8943a' }}></div>Lots Avicoles</div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lot</th>
                    <th>Type</th>
                    <th>Nb</th>
                    <th>Âge</th>
                    <th>Statut</th>
                    <th>Rendement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Lot A1</td><td>🐔 Pondeuses</td><td>1 200</td><td>18 sem.</td><td><span className="pill pill-green">Actif</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>88%</td></tr>
                  <tr><td>Lot A2</td><td>🐔 Pondeuses</td><td>1 600</td><td>32 sem.</td><td><span className="pill pill-green">Actif</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>91%</td></tr>
                  <tr><td>Lot B1</td><td>🐓 Chair</td><td>3 100</td><td>5 sem.</td><td><span className="pill pill-gold">Croissance</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>95%</td></tr>
                  <tr><td>Lot B4</td><td>🐓 Chair</td><td>3 100</td><td>3 sem.</td><td><span className="pill pill-red">Alerte</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>92%</td></tr>
                  <tr><td>Lot C1</td><td>🦃 Dinde</td><td>800</td><td>8 sem.</td><td><span className="pill pill-green">Actif</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>86%</td></tr>
                  <tr><td>Lot C2</td><td>🐦 Cailles</td><td>400</td><td>12 sem.</td><td><span className="pill pill-teal">Ponte</span></td><td style={{ fontFamily: 'var(--font-mono)' }}>94%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Production Œufs & Indicateurs</div>
            </div>
            <div className="panel-body">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--cream)', marginBottom: '16px' }}>4 320 œufs <span style={{ fontSize: '14px', color: 'var(--text3)' }}>/ jour</span></div>
              <div className="bar-chart" style={{ height: '70px', marginBottom: '16px' }}>
                <div className="bar-wrap"><div className="bar" style={{ height: '82%', background: 'var(--gold)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '85%', background: 'var(--gold)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>M</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '90%', background: 'var(--gold)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>M</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '78%', background: 'var(--gold)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>J</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '95%', background: 'var(--gold2)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>V</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '88%', background: 'var(--gold2)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>S</span></div>
                <div className="bar-wrap"><div className="bar" style={{ height: '72%', background: 'var(--gold)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>D</span></div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Taux ponte</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '90%', background: 'var(--gold)' }}></div></div>
                <div className="gauge-val">90%</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Conversion alim.</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '76%', background: 'var(--green)' }}></div></div>
                <div className="gauge-val">FCR 1.8</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Mortalité</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '8%', background: 'var(--red)' }}></div></div>
                <div className="gauge-val">0.8%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

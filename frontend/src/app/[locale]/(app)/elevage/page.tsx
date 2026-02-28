'use client';

import React from 'react';

export default function ElevagePage() {
  return (
    <div className="page active" id="page-elevage">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--amber)' }}>Module Élevage</div>
          <h1 className="page-title">Gestion du Cheptel Bovin & Ovin</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--amber)' } as React.CSSProperties}>
            <div className="kpi-icon">🐄</div>
            <div className="kpi-label">Bovins Total</div>
            <div className="kpi-value">48<span className="kpi-unit">têtes</span></div>
            <div className="kpi-trend up">▲ 4.3%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--amber)' } as React.CSSProperties}>
            <div className="kpi-icon">🐑</div>
            <div className="kpi-label">Ovins Total</div>
            <div className="kpi-value">120<span className="kpi-unit">têtes</span></div>
            <div className="kpi-trend down">▼ 2.1%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🥛</div>
            <div className="kpi-label">Production Lait</div>
            <div className="kpi-value">2 840<span className="kpi-unit">L/mois</span></div>
            <div className="kpi-trend up">▲ 6.2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">💰</div>
            <div className="kpi-label">Valeur Cheptel</div>
            <div className="kpi-value">1.6<span className="kpi-unit">MDH</span></div>
            <div className="kpi-trend up">▲ 5%</div>
          </div>
        </div>
        <div className="content-grid cg-21">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--amber)' }}></div>Inventaire Cheptel</div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Race</th>
                    <th>Nb</th>
                    <th>Âge Moy.</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'right' }}>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>🐄 Vaches laitières</td><td>Holstein</td><td>28</td><td>4.2 ans</td><td><span className="pill pill-green">En production</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>840 000 DH</td></tr>
                  <tr><td>🐂 Taureaux</td><td>Holstein</td><td>3</td><td>6.1 ans</td><td><span className="pill pill-green">Actif</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>120 000 DH</td></tr>
                  <tr><td>🐄 Veaux</td><td>Holstein</td><td>17</td><td>4 mois</td><td><span className="pill pill-gold">Croissance</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>204 000 DH</td></tr>
                  <tr><td>🐑 Brebis</td><td>Sardi</td><td>95</td><td>3.8 ans</td><td><span className="pill pill-green">En production</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>285 000 DH</td></tr>
                  <tr><td>🐏 Béliers</td><td>Sardi</td><td>8</td><td>5.0 ans</td><td><span className="pill pill-green">Actif</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>48 000 DH</td></tr>
                  <tr><td>🐑 Agneaux</td><td>Sardi</td><td>17</td><td>2 mois</td><td><span className="pill pill-gold">Croissance</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>51 000 DH</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Production Lait</div>
              </div>
              <div className="panel-body">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--cream)', marginBottom: '4px' }}>2 840 <span style={{ fontSize: '14px', color: 'var(--text3)' }}>L ce mois</span></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green2)', marginBottom: '14px' }}>▲ +6.2% vs mois dernier</div>
                <div className="bar-chart" style={{ height: '60px' }}>
                  <div className="bar-wrap"><div className="bar" style={{ height: '75%', background: 'var(--blue)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L1</span></div>
                  <div className="bar-wrap"><div className="bar" style={{ height: '82%', background: 'var(--blue)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L2</span></div>
                  <div className="bar-wrap"><div className="bar" style={{ height: '90%', background: 'var(--blue)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L3</span></div>
                  <div className="bar-wrap"><div className="bar" style={{ height: '78%', background: 'var(--blue)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L4</span></div>
                  <div className="bar-wrap"><div className="bar" style={{ height: '100%', background: 'var(--green2)' }}></div><span className="bar-label" style={{ fontSize: '7px' }}>L5</span></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title"><div className="dot" style={{ background: 'var(--red)' }}></div>Santé & Alertes</div>
              </div>
              <div className="panel-body">
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--gold)' }}></div>
                  <div>
                    <div className="alert-text">Vaccination FMD — dans 3 jours</div>
                    <div className="alert-time">28 bovins concernés</div>
                  </div>
                </div>
                <div className="alert-item">
                  <div className="alert-dot" style={{ background: 'var(--green)' }}></div>
                  <div>
                    <div className="alert-text">Agnelage Brebis #47 — prévu</div>
                    <div className="alert-time">Dans 8 jours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

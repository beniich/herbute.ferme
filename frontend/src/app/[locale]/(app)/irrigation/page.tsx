'use client';

import React from 'react';

export default function IrrigationPage() {
  return (
    <div className="page active" id="page-irrigation">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--blue)' }}>Eau & Ressources</div>
          <h1 className="page-title">Gestion de l'Irrigation</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">💧</div>
            <div className="kpi-label">Volume Stocké</div>
            <div className="kpi-value">24 000<span className="kpi-unit">m³</span></div>
            <div className="kpi-trend up">▲ 82% (Plein)</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">🚜</div>
            <div className="kpi-label">Débit Actuel</div>
            <div className="kpi-value">145<span className="kpi-unit">L/min</span></div>
            <div className="kpi-trend neutral">Stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">⚡</div>
            <div className="kpi-label">Energie Pompes</div>
            <div className="kpi-value">12.4<span className="kpi-unit">kWh</span></div>
            <div className="kpi-trend down">▼ Solaire actif</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🛡️</div>
            <div className="kpi-label">État Système</div>
            <div className="kpi-value">98<span className="kpi-unit">%</span></div>
            <div className="kpi-trend up">Opérationnel</div>
          </div>
        </div>
        
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Statut des Bassins & Puits</div>
            </div>
            <div className="panel-body">
              <div className="gauge-row">
                <div className="gauge-label">Bassin Principal</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '85%', background: 'var(--blue)' }}></div></div>
                <div className="gauge-val">85%</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Bassin Sud</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '72%', background: 'var(--blue)' }}></div></div>
                <div className="gauge-val">72%</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Niveau Puits P1</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '64%', background: 'var(--teal)' }}></div></div>
                <div className="gauge-val">-42m</div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Planning d'Irrigation</div>
            </div>
            <div className="panel-body">
              <div className="alert-item">
                <div className="alert-dot" style={{ background: 'var(--green)' }}></div>
                <div>
                  <div className="alert-text">Zone Nord (Menthe) — En cours</div>
                  <div className="alert-time">Fin prévue : 14h30</div>
                </div>
              </div>
              <div className="alert-item">
                <div className="alert-dot" style={{ background: 'var(--blue)' }}></div>
                <div>
                  <div className="alert-text">Zone Sud (Légumes) — Programmé</div>
                  <div className="alert-time">Début : 18h00 (Solaire/Batterie)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

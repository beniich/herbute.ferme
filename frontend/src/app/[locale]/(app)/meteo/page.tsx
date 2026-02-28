'use client';

import React from 'react';

export default function MeteoPage() {
  return (
    <div className="page active" id="page-meteo">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--blue)' }}>Météo & Environnement</div>
          <h1 className="page-title">Station Météo du Domaine</h1>
        </div>
        
        <div className="weather-widget" style={{ marginBottom: '24px', padding: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '3px', marginBottom: '8px' }}>STATION PRINCIPALE · RABAT-RÉGION</div>
            <div className="weather-main" style={{ fontSize: '64px' }}>22°C</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text2)' }}>Ensoleillé · Vent Nord-Ouest 12 km/h</div>
          </div>
          <div style={{ display: 'flex', gap: '48px' }}>
            <div className="weather-detail" style={{ fontSize: '14px', line_height: '2.5' }}>
              <div>💧 Humidité : <span style={{ color: 'var(--text)' }}>48%</span></div>
              <div>🌧️ Prob. Pluie : <span style={{ color: 'var(--text)' }}>5%</span></div>
              <div>☀️ Indice UV : <span style={{ color: 'var(--gold2)' }}>7 (Élevé)</span></div>
            </div>
            <div className="weather-detail" style={{ fontSize: '14px', line_height: '2.5' }}>
              <div>🌡️ Point de rosée : <span style={{ color: 'var(--text)' }}>12°C</span></div>
              <div>💨 Rafales : <span style={{ color: 'var(--text)' }}>18 km/h</span></div>
              <div>👁️ Visibilité : <span style={{ color: 'var(--text)' }}>15 km</span></div>
            </div>
          </div>
          <div className="weather-icon" style={{ fontSize: '84px' }}>☀️</div>
        </div>

        <div className="content-grid cg-3">
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Prévisions 5 Jours</div></div>
            <div className="panel-body">
              <div className="compact-row"><div className="cr-name">Demain</div><div className="cr-val">24° / 15°</div><div className="cr-sub">☀️ Ensoleillé</div></div>
              <div className="compact-row"><div className="cr-name">Mercredi</div><div className="cr-val">22° / 14°</div><div className="cr-sub">⛅ Part. Nuageux</div></div>
              <div className="compact-row"><div className="cr-name">Jeudi</div><div className="cr-val">19° / 12°</div><div className="cr-sub">🌧️ Pluie éparse</div></div>
              <div className="compact-row"><div className="cr-name">Vendredi</div><div className="cr-val">18° / 11°</div><div className="cr-sub">☁️ Nuageux</div></div>
              <div className="compact-row"><div className="cr-name">Samedi</div><div className="cr-val">21° / 13°</div><div className="cr-sub">☀️ Éclaircies</div></div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Capteurs Sols</div></div>
            <div className="panel-body">
              <div className="gauge-row">
                <div className="gauge-label">Humidité Zone A</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '42%', background: 'var(--teal)' }}></div></div>
                <div className="gauge-val">42%</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Humidité Zone B</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '38%', background: 'var(--teal)' }}></div></div>
                <div className="gauge-val">38%</div>
              </div>
              <div className="gauge-row">
                <div className="gauge-label">Température Sol</div>
                <div className="gauge-track"><div className="gauge-fill" style={{ width: '65%', background: 'var(--amber)' }}></div></div>
                <div className="gauge-val">18.5°C</div>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(90,158,69,0.1)', border: '1px solid rgba(90,158,69,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--green2)' }}>✅ Conditions optimales pour semis</div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Alertes Météo</div></div>
            <div className="panel-body">
              <div className="alert-item">
                <div className="alert-dot" style={{ background: 'var(--blue)' }}></div>
                <div>
                  <div className="alert-text">Baisse de température prévue jeudi</div>
                  <div className="alert-time">Protection cultures recommandées</div>
                </div>
              </div>
              <div className="alert-item">
                <div className="alert-dot" style={{ background: 'var(--green)' }}></div>
                <div>
                  <div className="alert-text">Pas de vent fort prévu (7 jours)</div>
                  <div className="alert-time">Favorable aux traitements</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

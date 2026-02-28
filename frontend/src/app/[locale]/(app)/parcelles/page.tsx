'use client';

import React from 'react';

export default function ParcellesPage() {
  return (
    <div className="page active" id="page-parcelles">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--green)' }}>Gestion des Terres</div>
          <h1 className="page-title">Parcelles & Cultures</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🗺️</div>
            <div className="kpi-label">Nb Parcelles</div>
            <div className="kpi-value">24<span className="kpi-unit">unités</span></div>
            <div className="kpi-trend neutral">= stable</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green2)' } as React.CSSProperties}>
            <div className="kpi-icon">🌾</div>
            <div className="kpi-label">Surface Cultivée</div>
            <div className="kpi-value">218<span className="kpi-unit">ha</span></div>
            <div className="kpi-trend up">▲ 2.5%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">💧</div>
            <div className="kpi-label">Irrigation active</div>
            <div className="kpi-value">18<span className="kpi-unit">parc.</span></div>
            <div className="kpi-trend neutral">75% total</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🚜</div>
            <div className="kpi-label">Traitement en cours</div>
            <div className="kpi-value">2<span className="kpi-unit">parc.</span></div>
            <div className="kpi-trend neutral">Parcelle P7, P12</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--green)' }}></div>Registre des Parcelles</div>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom / Localisation</th>
                  <th>Culture</th>
                  <th>Surface</th>
                  <th>Stade</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>P01</td><td>Plaine Nord A</td><td>🌿 Menthe</td><td>12 ha</td><td>Récolte</td><td><span className="pill pill-green">Opérationnel</span></td></tr>
                <tr><td>P02</td><td>Plaine Nord B</td><td>🌿 Absinthe</td><td>8.5 ha</td><td>Croissance</td><td><span className="pill pill-green">Opérationnel</span></td></tr>
                <tr><td>P03</td><td>Colline Ouest</td><td>🌳 Oliviers</td><td>24 ha</td><td>Entretien</td><td><span className="pill pill-green">Opérationnel</span></td></tr>
                <tr><td>P04</td><td>Zone Basse</td><td>🥕 Carottes</td><td>5.2 ha</td><td>Semis</td><td><span className="pill pill-teal">Irrigation</span></td></tr>
                <tr><td>P05</td><td>Plaine Est</td><td>🌾 Blé tendre</td><td>42 ha</td><td>Croissance</td><td><span className="pill pill-green">Opérationnel</span></td></tr>
                <tr><td>P06</td><td>Zone Sud</td><td>🍅 Tomates</td><td>4.8 ha</td><td>Floraison</td><td><span className="pill pill-gold">Traitement</span></td></tr>
                <tr><td>P07</td><td>Zone Sud-Est</td><td>🧅 Oignons</td><td>6.5 ha</td><td>Croissance</td><td><span className="pill pill-green">Opérationnel</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-grid cg-2" style={{ marginTop: '20px' }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Répartition des Cultures</div></div>
            <div className="panel-body">
              <div className="gauge-row"><div className="gauge-label">🌾 Céréales</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '45%', background: 'var(--amber)' }}></div></div><div className="gauge-val">45%</div></div>
              <div className="gauge-row"><div className="gauge-label">🌿 P.A.M</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '25%', background: 'var(--green)' }}></div></div><div className="gauge-val">25%</div></div>
              <div className="gauge-row"><div className="gauge-label">🌳 Arboriculture</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '20%', background: 'var(--green2)' }}></div></div><div className="gauge-val">20%</div></div>
              <div className="gauge-row"><div className="gauge-label">🥕 Maraîchage</div><div className="gauge-track"><div className="gauge-fill" style={{ width: '10%', background: 'var(--teal)' }}></div></div><div className="gauge-val">10%</div></div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Santé Végétale (Satelite)</div></div>
            <div className="panel-body">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '42px', color: 'var(--green2)', fontWeight: 'bold' }}>NDVI 0.78</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>Indice de vigueur moyen du domaine</div>
                <div style={{ marginTop: '16px', color: 'var(--text2)', fontSize: '13px' }}>
                  📈 +4% par rapport à la moyenne saisonnière
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

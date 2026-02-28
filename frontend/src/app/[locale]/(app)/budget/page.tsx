'use client';

import React from 'react';

export default function BudgetPage() {
  return (
    <div className="page active" id="page-budget">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--gold)' }}>Budget & Finance</div>
          <h1 className="page-title">Tableau de Bord Financier 2026</h1>
        </div>
        <div className="kpi-grid kpi-grid-3">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">🎯</div>
            <div className="kpi-label">Objectif Revenus</div>
            <div className="kpi-value">9<span className="kpi-unit">MDH</span></div>
            <div className="kpi-trend neutral">Annuel 2026</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">📊</div>
            <div className="kpi-label">Budget Charges</div>
            <div className="kpi-value">5.4<span className="kpi-unit">MDH</span></div>
            <div className="kpi-trend neutral">Annuel 2026</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🏗️</div>
            <div className="kpi-label">Budget Investissements</div>
            <div className="kpi-value">1.5<span className="kpi-unit">MDH</span></div>
            <div className="kpi-trend neutral">Annuel 2026</div>
          </div>
        </div>
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Avancement Budget Annuel</div>
            </div>
            <div className="panel-body">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', marginBottom: '16px' }}>Exercice 2026 · Mois de Février (2/12)</div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Revenus Réalisés</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green2)' }}>16.4% → 1.48 MDH / 9 MDH</span></div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '16.4%', height: '100%', background: 'linear-gradient(90deg,var(--green),var(--green2))', borderRadius: '4px' }}></div></div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Charges Consommées</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e87070' }}>16.5% → 892K / 5.4 MDH</span></div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '16.5%', height: '100%', background: 'var(--red)', borderRadius: '4px' }}></div></div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Investissements Réalisés</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--blue)' }}>22.6% → 340K / 1.5 MDH</span></div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '22.6%', height: '100%', background: 'var(--blue)', borderRadius: '4px' }}></div></div>
              </div>
              <div style={{ background: 'rgba(90,158,69,0.08)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', marginBottom: '6px' }}>RÉSULTAT BIMESTRIEL</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--green2)', fontWeight: 700 }}>+ 590 000 DH</div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--amber)' }}></div>Prévisionnel par Secteur</div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <table className="data-table">
                <thead><tr><th>Secteur</th><th style={{ textAlign: 'right' }}>Budget</th><th style={{ textAlign: 'right' }}>Réalisé</th><th>Écart</th></tr></thead>
                <tbody>
                  <tr><td>🐄 Élevage</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>2.8 MDH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>480K</td><td><span className="pill pill-green">+1.2%</span></td></tr>
                  <tr><td>🐓 Aviculture</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>2.1 MDH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>320K</td><td><span className="pill pill-gold">-0.8%</span></td></tr>
                  <tr><td>🌿 Herbes</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>1.2 MDH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>210K</td><td><span className="pill pill-green">+3.2%</span></td></tr>
                  <tr style={{ fontWeight: 700 }}><td style={{ color: 'var(--cream)' }}>TOTAL</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold2)' }}>9 MDH</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--green2)' }}>1.48M</td><td><span className="pill pill-green">+1.4%</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

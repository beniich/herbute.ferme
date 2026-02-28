'use client';

import React from 'react';

export default function ComptabilitePage() {
  return (
    <div className="page active" id="page-comptabilite">
      <div style={{ padding: '24px' }}>
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--purple)' }}>Module Comptabilité</div>
          <h1 className="page-title">Bilan & Compte de Résultat</h1>
        </div>
        <div className="kpi-grid kpi-grid-4">
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">📈</div>
            <div className="kpi-label">Total Recettes</div>
            <div className="kpi-value">1 482<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 14.2%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">📉</div>
            <div className="kpi-label">Total Charges</div>
            <div className="kpi-value">892<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend down">▲ 4.1%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--purple)' } as React.CSSProperties}>
            <div className="kpi-icon">💎</div>
            <div className="kpi-label">Marge Brute</div>
            <div className="kpi-value">590<span className="kpi-unit">KDH</span></div>
            <div className="kpi-trend up">▲ 22.7%</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">📊</div>
            <div className="kpi-label">Taux de Marge</div>
            <div className="kpi-value">39.8<span className="kpi-unit">%</span></div>
            <div className="kpi-trend up">▲ 5.8%</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'rgba(138,82,184,0.18)', border: '1px solid rgba(138,82,184,0.35)', color: '#b87cb8', cursor: 'pointer', letterSpacing: '1px' }}>📄 Exporter Rapport PDF</button>
          <button style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'rgba(90,158,69,0.15)', border: '1px solid rgba(90,158,69,0.3)', color: 'var(--green2)', cursor: 'pointer', letterSpacing: '1px' }}>📊 Exporter Excel / CSV</button>
        </div>
        <div className="content-grid cg-2">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--purple)' }}></div>Compte de Résultat · 2026</div>
            </div>
            <div className="panel-body">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--green)', letterSpacing: '2px', marginBottom: '10px' }}>▸ PRODUITS D'EXPLOITATION</div>
              <div className="fin-row"><div className="fin-label">Ventes Élevage bovin</div><div className="fin-val fin-rec">+480 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Ventes Aviculture</div><div className="fin-val fin-rec">+320 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Ventes Herbes & Aromates</div><div className="fin-val fin-rec">+210 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Ventes Légumes & Fruits</div><div className="fin-val fin-rec">+180 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Revenus Forestiers</div><div className="fin-val fin-rec">+140 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Pépinière & Autres</div><div className="fin-val fin-rec">+152 000 DH</div></div>
              <div className="fin-row" style={{ borderTop: '1px solid var(--border2)', paddingTop: '10px', marginTop: '4px' }}><div className="fin-label" style={{ color: 'var(--cream)', fontWeight: 600 }}>TOTAL PRODUITS</div><div className="fin-val" style={{ color: 'var(--green2)', fontSize: '14px' }}>1 482 000 DH</div></div>
              
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#e87070', letterSpacing: '2px', margin: '14px 0 10px' }}>▸ CHARGES D'EXPLOITATION</div>
              <div className="fin-row"><div className="fin-label">Alimentation animale</div><div className="fin-val fin-dep">−248 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Intrants agricoles</div><div className="fin-val fin-dep">−186 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Main d'œuvre</div><div className="fin-val fin-dep">−280 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Carburant & Énergie</div><div className="fin-val fin-dep">−82 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Frais vétérinaires</div><div className="fin-val fin-dep">−54 000 DH</div></div>
              <div className="fin-row"><div className="fin-label">Amortissements</div><div className="fin-val fin-dep">−42 000 DH</div></div>
              <div className="fin-row" style={{ borderTop: '1px solid var(--border2)', paddingTop: '10px', marginTop: '4px' }}><div className="fin-label" style={{ color: 'var(--cream)', fontWeight: 600 }}>TOTAL CHARGES</div><div className="fin-val" style={{ color: '#e87070', fontSize: '14px' }}>892 000 DH</div></div>
              <div className="fin-row" style={{ background: 'rgba(90,158,69,0.08)', borderRadius: '8px', padding: '12px', marginTop: '10px', border: '1px solid rgba(90,158,69,0.2)' }}>
                <div className="fin-label" style={{ color: 'var(--green2)', fontSize: '14px', fontWeight: 600 }}>✅ RÉSULTAT NET</div>
                <div className="fin-val" style={{ color: 'var(--green2)', fontSize: '18px' }}>+590 000 DH</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Bilan Patrimonial</div>
              </div>
              <div className="panel-body">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--blue)', letterSpacing: '2px', marginBottom: '10px' }}>ACTIF</div>
                <div className="fin-row"><div className="fin-label">Terres & Domaine (340 ha)</div><div className="fin-val" style={{ color: 'var(--text)' }}>4 200 000 DH</div></div>
                <div className="fin-row"><div className="fin-label">Forêt (valeur boisée)</div><div className="fin-val" style={{ color: 'var(--text)' }}>820 000 DH</div></div>
                <div className="fin-row"><div className="fin-label">Cheptel total</div><div className="fin-val" style={{ color: 'var(--text)' }}>1 596 000 DH</div></div>
                <div className="fin-row"><div className="fin-label">Équipements & Machines</div><div className="fin-val" style={{ color: 'var(--text)' }}>680 000 DH</div></div>
                <div className="fin-row"><div className="fin-label">Bâtiments & Infrastructure</div><div className="fin-val" style={{ color: 'var(--text)' }}>1 200 000 DH</div></div>
                <div className="fin-row"><div className="fin-label">TOTAL ACTIF</div><div className="fin-val" style={{ color: 'var(--blue)', fontSize: '14px' }}>8 964 000 DH</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

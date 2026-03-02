'use client';

import React from 'react';

export default function RosterPage() {
    return (
        <div className="page active" id="page-roster">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--green)' }}>Organisation</div>
                    <h1 className="page-title">Planning RH</h1>
                    <div className="page-sub">Gestion des emplois du temps et présences</div>
                </div>

                <div className="kpi-grid kpi-grid-3" style={{ marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
                        <div className="kpi-icon">👥</div>
                        <div className="kpi-label">Employés Présents</div>
                        <div className="kpi-value">45<span className="kpi-unit">/52</span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
                        <div className="kpi-icon">🏖️</div>
                        <div className="kpi-label">En Congés</div>
                        <div className="kpi-value">5<span className="kpi-unit">personnes</span></div>
                    </div>
                    <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
                        <div className="kpi-icon">⏱️</div>
                        <div className="kpi-label">Heures Suppl.</div>
                        <div className="kpi-value">12<span className="kpi-unit">heures (ce mois)</span></div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title"><div className="dot" style={{ background: 'var(--green)' }}></div>Module en cours d'intégration</div>
                    </div>
                    <div className="panel-body">
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓️</div>
                            <h3>Le planning RH graphique sera disponible dans la prochaine mise à jour.</h3>
                            <p style={{ marginTop: '8px', maxWidth: '400px', margin: '0 auto' }}>
                                Vous pourrez gérer le calendrier de présence, assosier des équipes par poste et suivre les temps de travail.
                            </p>
                        </div>
                    </div>
                </div>
        </div>
    );
}

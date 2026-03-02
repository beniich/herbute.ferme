'use client';

import React from 'react';

export default function PlanningPage() {
    return (
        <div className="page active" id="page-planning">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--blue)' }}>Organisation</div>
                    <h1 className="page-title">Calendrier &amp; Planning</h1>
                    <div className="page-sub">Vue agenda des travaux et cycles agricoles</div>
                </div>

                <div className="content-grid cg-2" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <div className="panel">
                        <div className="panel-header"><div className="panel-title">Filtres Agenda</div></div>
                        <div className="panel-body">
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text2)' }}>
                                <li><label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Cycles cultures</label></li>
                                <li><label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Tâches d'ouvriers</label></li>
                                <li><label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Réunions Admin</label></li>
                                <li><label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" /> Livraisons prévues</label></li>
                            </ul>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="panel-header"><div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Semaine du {new Date().toLocaleDateString()}</div></div>
                        <div className="panel-body">
                            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text3)' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                                <h3>Module Calendrier Complet à venir</h3>
                                <p style={{ maxWidth: '400px', margin: '8px auto 0' }}>La vue mensuelle et hebdomadaire de planification des interventions sera implémentée via une librairie de calendrier interactive.</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

'use client';

import React from 'react';

export default function SettingsPage() {
    return (
        <div className="page active" id="page-settings">
            <div className="page-header">
                    <div className="page-label" style={{ color: 'var(--red)' }}>Administration</div>
                    <h1 className="page-title">Paramètres Généraux</h1>
                    <div className="page-sub">Configuration globale du domaine et préférences applicatives</div>
                </div>

                <div className="content-grid cg-2" style={{ gridTemplateColumns: 'minmax(250px, 1fr) 3fr' }}>
                    <div className="panel" style={{ background: 'transparent', border: 'none' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--green2)', borderLeft: '4px solid var(--green)', borderRadius: '0 8px 8px 0', fontWeight: 'bold', cursor: 'pointer' }}>Organisation & Profil</li>
                            <li style={{ padding: '14px 16px', color: 'var(--text2)', cursor: 'pointer', hover: { color: 'var(--text)' } }}>Utilisateurs & Rôles</li>
                            <li style={{ padding: '14px 16px', color: 'var(--text2)', cursor: 'pointer' }}>Notifications (Email / SMS)</li>
                            <li style={{ padding: '14px 16px', color: 'var(--text2)', cursor: 'pointer' }}>Intégrations IoT & API</li>
                            <li style={{ padding: '14px 16px', color: 'var(--text2)', cursor: 'pointer' }}>Sécurité & Authentification</li>
                            <li style={{ padding: '14px 16px', color: 'var(--text2)', cursor: 'pointer' }}>Facturation & Abonnements</li>
                        </ul>
                    </div>

                    <div className="panel">
                        <div className="panel-header"><div className="panel-title">Profil du Domaine</div></div>
                        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label>Nom du domaine agricole</label>
                                <input type="text" defaultValue="Domaine AgroMaître Principal" style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                            </div>
                            <div className="form-group">
                                <label>SIRET / ID Légal</label>
                                <input type="text" defaultValue="123 456 789 00010" style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                            </div>
                            <div className="form-group">
                                <label>Devise Principale</label>
                                <select style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
                                    <option>MAD - Dirham Marocain</option>
                                    <option>EUR - Euro</option>
                                    <option>USD - Dollar US</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Langue par défaut</label>
                                <select style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
                                    <option>Français (FR)</option>
                                    <option>Arabe (AR)</option>
                                    <option>Anglais (EN)</option>
                                </select>
                            </div>
                            <div style={{ padding: '24px 0 0', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                                <button style={{ background: 'var(--green)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Sauvegarder les modifications</button>
                                <button style={{ background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

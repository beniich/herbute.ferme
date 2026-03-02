'use client';

import React, { useState } from 'react';

type ReportFormat = 'PDF' | 'EXCEL' | 'CSV';
type ReportFrequency = 'MONTHLY' | 'ANNUAL' | 'CUSTOM';
type ReportStatus = 'ARCHIVED' | 'COLD_STORAGE' | 'COMPRESSED' | 'PROCESSING';

interface Report {
  id: string;
  name: string;
  description: string;
  date: string;
  format: ReportFormat;
  size: string;
  status: ReportStatus;
}

const mockReports: Report[] = [
  { id: '1', name: 'Bilan_Annuel_2023.pdf', description: 'Bilan complet de l\'année', date: '28 Oct 2023', format: 'PDF', size: '4.2 MB', status: 'ARCHIVED' },
  { id: '2', name: 'Export_Cultures_Sept_2023.xlsx', description: 'Export des données brutes', date: '02 Oct 2023', format: 'EXCEL', size: '1.8 MB', status: 'COLD_STORAGE' },
  { id: '3', name: 'Log_Irrigation_Archive.csv', description: 'Archive historique', date: '15 Aou 2023', format: 'CSV', size: '28.4 MB', status: 'COMPRESSED' },
  { id: '4', name: 'Rapport_Elevage_Q3.pdf', description: 'En cours de génération', date: 'Calcul...', format: 'PDF', size: '--', status: 'PROCESSING' }
];

export default function ReportsPage() {
  const [frequency, setFrequency] = useState<ReportFrequency>('MONTHLY');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'ARCHIVED': return <span className="pill pill-blue">Archivé</span>;
      case 'COLD_STORAGE': return <span className="pill pill-gold">Stockage Froid</span>;
      case 'COMPRESSED': return <span className="pill pill-brown">Compressé</span>;
      case 'PROCESSING': return <span className="pill pill-green">En cours...</span>;
    }
  };

  return (
    <div className="page active" id="page-reports">
        <div className="page-header">
          <div className="page-label" style={{ color: 'var(--gold)' }}>Export &amp; Analyse</div>
          <h1 className="page-title">Rapports &amp; Export</h1>
          <div className="page-sub">Génération automatisée et archives des données du domaine</div>
        </div>

        <div className="kpi-grid kpi-grid-3" style={{ marginBottom: '24px' }}>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">📊</div>
            <div className="kpi-label">Rapports Générés</div>
            <div className="kpi-value">128<span className="kpi-unit">fichiers</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">💾</div>
            <div className="kpi-label">Espace Stockage</div>
            <div className="kpi-value">4.2<span className="kpi-unit">GB</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">⚙️</div>
            <div className="kpi-label">Tâches en cours</div>
            <div className="kpi-value">1<span className="kpi-unit">tâche</span></div>
          </div>
        </div>

        <div className="content-grid cg-2" style={{ marginBottom: '24px' }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--gold)' }}></div>Générateur de Rapport</div>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label>Fréquence / Période</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['MONTHLY', 'ANNUAL', 'CUSTOM'] as const).map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFrequency(f)}
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        background: frequency === f ? 'rgba(200,146,26,0.15)' : 'rgba(255,255,255,0.02)',
                        border: frequency === f ? '1px solid rgba(200,146,26,0.4)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        color: frequency === f ? 'var(--gold2)' : 'var(--text2)',
                        cursor: 'pointer',
                        fontWeight: frequency === f ? 700 : 400
                      }}
                    >
                      {f === 'MONTHLY' ? 'Mensuel' : f === 'ANNUAL' ? 'Annuel' : 'Personnalisé'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Format d&apos;export</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['PDF', 'EXCEL', 'CSV'] as const).map(f => (
                    <button 
                      key={f} 
                      onClick={() => setSelectedFormat(f)}
                      style={{ 
                        flex: 1, 
                        padding: '16px 10px', 
                        background: selectedFormat === f ? 'rgba(200,146,26,0.15)' : 'rgba(255,255,255,0.02)',
                        border: selectedFormat === f ? '1px solid rgba(200,146,26,0.4)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        color: selectedFormat === f ? 'var(--gold2)' : 'var(--text2)',
                        cursor: 'pointer',
                        fontWeight: selectedFormat === f ? 700 : 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>
                        {f === 'PDF' ? '📄' : f === 'EXCEL' ? '📊' : '📝'}
                      </span>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ 
                  width: '100%',
                  marginTop: '24px',
                  padding: '14px',
                  background: 'var(--gold)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isGenerating ? 'wait' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? 'Génération en cours...' : 'Générer le rapport maintenant'}
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot" style={{ background: 'var(--green)' }}></div>Données Récentes</div>
            </div>
            <div className="panel-body">
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                Intégration des synthèses agricoles prévue dans la prochaine version.
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--blue)' }}></div>Archives Historiques</div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom du Rapport</th>
                  <th>Date</th>
                  <th>Format</th>
                  <th>Taille</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report) => (
                  <tr key={report.id}>
                    <td style={{ fontWeight: 700 }}>{report.name}</td>
                    <td>{report.date}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{report.format}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{report.size}</td>
                    <td>{getStatusBadge(report.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

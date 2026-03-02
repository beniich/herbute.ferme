'use client';

import React, { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { useCrops, useAnimals } from '@/hooks/useProductionData';

// ─── Types ────────────────────────────────────────────────────────────────
interface Crop {
  _id: string; name: string; variety?: string; area?: number;
  yieldEstimate?: number; status: string; category?: string;
}
interface Animal {
  _id: string; name: string; species: string; breed?: string;
  birthDate?: string; health?: string; healthStatus?: string;
}

// ─── Pill statut ─────────────────────────────────────────────────────────
const StatusPill = memo(({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    GROWING:    { label: 'En croissance', cls: 'pill-green' },
    HARVESTED:  { label: 'Récolté',       cls: 'pill-blue'  },
    PLANTED:    { label: 'Planté',        cls: 'pill-gold'  },
    FAILED:     { label: 'Échec',         cls: 'pill-red'   },
    healthy:    { label: 'Sain',          cls: 'pill-green' },
    ill:        { label: 'Malade',        cls: 'pill-red'   },
    recovering: { label: 'Convalescent', cls: 'pill-gold'  },
  };
  const s = map[status] ?? { label: status, cls: 'pill-blue' };
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
});
StatusPill.displayName = 'StatusPill';

// ─── Tableau Cultures ─────────────────────────────────────────────────────
const CropTable = memo(({ crops }: { crops: Crop[] }) => {
  const totalYield = useMemo(() =>
    crops.reduce((s, c) => s + (c.yieldEstimate || 0), 0), [crops]);
  const growingCount = useMemo(() =>
    crops.filter(c => c.status === 'GROWING').length, [crops]);

  if (crops.length === 0)
    return <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Aucune culture trouvée</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: 'Total cultures',           value: crops.length,                        unit: 'lots', color: 'var(--blue)'  },
          { label: 'En croissance',             value: growingCount,                         unit: 'lots', color: 'var(--green)' },
          { label: 'Rendement total estimé',   value: totalYield.toLocaleString('fr-FR'), unit: 'kg',   color: 'var(--gold)'  },
        ].map(stat => (
          <div key={stat.label} className="kpi-card" style={{ flex: 1, '--kpi-color': stat.color } as React.CSSProperties}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value">{stat.value}<span className="kpi-unit"> {stat.unit}</span></div>
          </div>
        ))}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Culture</th><th>Variété</th><th>Surface</th>
            <th style={{ textAlign: 'right' }}>Rendement estimé</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(crop => (
            <tr key={crop._id}>
              <td style={{ fontWeight: 500 }}>{crop.name}</td>
              <td style={{ color: 'var(--text3)' }}>{crop.variety || '—'}</td>
              <td>{crop.area ? `${crop.area} ha` : '—'}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--green2)' }}>
                {crop.yieldEstimate ? `${crop.yieldEstimate.toLocaleString('fr-FR')} kg` : '—'}
              </td>
              <td><StatusPill status={crop.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
CropTable.displayName = 'CropTable';

// ─── Tableau Animaux ─────────────────────────────────────────────────────
const AnimalTable = memo(({ animals }: { animals: Animal[] }) => {
  const healthyCount = useMemo(() =>
    animals.filter(a => (a.health || a.healthStatus) === 'healthy').length, [animals]);
  const illCount = useMemo(() =>
    animals.filter(a => (a.health || a.healthStatus) === 'ill').length, [animals]);

  if (animals.length === 0)
    return <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>Aucun animal trouvé</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: 'Cheptel total', value: animals.length, unit: 'têtes', color: 'var(--amber)' },
          { label: 'Sains',         value: healthyCount,   unit: 'têtes', color: 'var(--green)' },
          { label: 'Malades',       value: illCount,       unit: 'têtes', color: 'var(--red)'   },
        ].map(stat => (
          <div key={stat.label} className="kpi-card" style={{ flex: 1, '--kpi-color': stat.color } as React.CSSProperties}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value">{stat.value}<span className="kpi-unit"> {stat.unit}</span></div>
          </div>
        ))}
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Nom</th><th>Espèce</th><th>Race</th><th>Naissance</th><th>Santé</th></tr>
        </thead>
        <tbody>
          {animals.map(animal => (
            <tr key={animal._id}>
              <td style={{ fontWeight: 500 }}>{animal.name}</td>
              <td style={{ textTransform: 'capitalize' }}>{animal.species}</td>
              <td style={{ color: 'var(--text3)' }}>{animal.breed || '—'}</td>
              <td>{animal.birthDate ? new Date(animal.birthDate).toLocaleDateString('fr-FR') : '—'}</td>
              <td><StatusPill status={animal.health || animal.healthStatus || 'unknown'} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
AnimalTable.displayName = 'AnimalTable';

// ─── Page principale ──────────────────────────────────────────────────────
export default function ProductionPage() {
  const [tab, setTab] = useState<'crops' | 'animals'>('crops');
  const { crops,   loading: cropsLoading,   refresh: refreshCrops   } = useCrops();
  const { animals, loading: animalsLoading, refresh: refreshAnimals } = useAnimals();

  const loading = tab === 'crops' ? cropsLoading : animalsLoading;
  const refresh = tab === 'crops' ? refreshCrops : refreshAnimals;

  return (
    <div className="page active">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <div className="page-label">Exploitation · Données temps réel</div>
          <h1 className="page-title">🌾 Levage & Récolte</h1>
          <div className="page-sub">Vue consolidée cultures et élevage</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => refresh()}
            style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}
          >
            ↺ Actualiser
          </button>
          <Link href="/image-correction" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', background: 'rgba(90,158,69,0.12)', border: '1px solid rgba(90,158,69,0.25)', color: 'var(--green2)', cursor: 'pointer' }}>
              📷 Analyser images
            </button>
          </Link>
        </div>
      </div>

      {/* ONGLETS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['crops', 'animals'] as const).map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.5px',
              background: tab === key ? 'rgba(58,122,184,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${tab === key ? 'rgba(58,122,184,0.4)' : 'var(--border)'}`,
              color: tab === key ? 'var(--blue)' : 'var(--text2)',
            }}
          >
            {key === 'crops' ? '🌾 Récoltes' : '🐄 Élevage'}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <div className="panel">
        <div className="panel-body" style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px' }}>
              Chargement...
            </div>
          ) : (
            <>
              {tab === 'crops'   && <CropTable   crops={crops}     />}
              {tab === 'animals' && <AnimalTable animals={animals} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

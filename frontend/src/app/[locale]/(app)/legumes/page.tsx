'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cropsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';

interface Crop {
  _id: string;
  name: string;
  category: string;
  plotId: string;
  status: string;
  plantedDate: string;
  expectedHarvestDate?: string;
  estimatedYield: number;
  surface?: number;
  notes?: string;
}

interface CropForm {
  name: string;
  category: string;
  plotId: string;
  status: string;
  plantedDate: string;
  expectedHarvestDate: string;
  estimatedYield: number | string;
  surface: number | string;
  notes: string;
}

const EMPTY_FORM: CropForm = {
  name: '', category: 'VEGETABLE', plotId: '', status: 'PLANTED',
  plantedDate: new Date().toISOString().split('T')[0], expectedHarvestDate: '',
  estimatedYield: '', surface: '', notes: ''
};

const STATUS_MAP: Record<string, { label: string; pill: string }> = {
  PLANTED:   { label: 'Planté',          pill: 'pill-blue' },
  GROWING:   { label: 'En croissance',   pill: 'pill-green' },
  READY:     { label: 'Prêt à récolter', pill: 'pill-gold' },
  HARVESTED: { label: 'Récolté',         pill: 'pill-teal' },
};

const CATEGORY_LABEL: Record<string, string> = {
  VEGETABLE: 'Légumes & Fruits',
  HERB:      'Herbes & Aromates',
  NURSERY:   'Pépinière',
  FOREST:    'Forêt',
};

interface LegumesPageProps {
  category?: string;
  pageTitle?: string;
  pageLabel?: string;
  pageIcon?: string;
}

export default function LegumesPage({ category = 'VEGETABLE', pageTitle = 'Légumes & Fruits', pageLabel = 'Module Cultures', pageIcon = '🥕' }: LegumesPageProps) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CropForm>({ ...EMPTY_FORM, category });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [harvestModal, setHarvestModal] = useState<string | null>(null);
  const [actualYield, setActualYield] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cropsApi.getAll({ category }) as any;
      setCrops(res?.data || []);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm({ ...EMPTY_FORM, category }); setEditingId(null); setShowModal(true); };
  const openEdit = (c: Crop) => {
    setForm({
      name: c.name, category: c.category, plotId: c.plotId, status: c.status,
      plantedDate: c.plantedDate?.split('T')[0] || '',
      expectedHarvestDate: c.expectedHarvestDate?.split('T')[0] || '',
      estimatedYield: c.estimatedYield, surface: c.surface || '', notes: c.notes || ''
    });
    setEditingId(c._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setForm({ ...EMPTY_FORM, category }); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        estimatedYield: Number(form.estimatedYield),
        surface: form.surface ? Number(form.surface) : undefined,
        expectedHarvestDate: form.expectedHarvestDate || undefined,
      };
      if (editingId) {
        await cropsApi.update(editingId, payload);
        toast.success('Culture modifiée');
      } else {
        await cropsApi.create(payload);
        toast.success('Culture ajoutée');
      }
      closeModal();
      fetchData();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cropsApi.delete(id);
      toast.success('Supprimé');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleHarvest = async () => {
    if (!harvestModal || !actualYield) return;
    try {
      await cropsApi.harvest(harvestModal, Number(actualYield));
      toast.success('Récolte enregistrée !');
      setHarvestModal(null);
      setActualYield('');
      fetchData();
    } catch {
      toast.error('Erreur');
    }
  };

  const totalSurface = crops.reduce((s, c) => s + (c.surface || 0), 0);
  const readyCount = crops.filter(c => c.status === 'READY').length;

  return (
    <div className="page active">
      <div style={{ padding: '24px' }}>
        <PageHeader 
          label={pageLabel}
          title={pageTitle}
          subtitle="Suivi des cultures · Données depuis la base de données"
          actions={
            <button onClick={openCreate} style={{ padding: '10px 20px', background: 'rgba(90,158,69,0.15)', border: '1px solid rgba(90,158,69,0.4)', borderRadius: '10px', color: 'var(--green2)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer' }}>
              ➕ Nouvelle Culture
            </button>
          }
        />

        {/* KPIs */}
        <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '24px' }}>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">{pageIcon}</div>
            <div className="kpi-label">Cultures Actives</div>
            <div className="kpi-value">{loading ? '—' : crops.length}<span className="kpi-unit">lots</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--gold)' } as React.CSSProperties}>
            <div className="kpi-icon">🌿</div>
            <div className="kpi-label">Surface Totale</div>
            <div className="kpi-value">{loading ? '—' : totalSurface.toFixed(1)}<span className="kpi-unit">ha</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--amber)' } as React.CSSProperties}>
            <div className="kpi-icon">✅</div>
            <div className="kpi-label">Prêt à Récolter</div>
            <div className="kpi-value">{loading ? '—' : readyCount}<span className="kpi-unit">lots</span></div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--teal)' } as React.CSSProperties}>
            <div className="kpi-icon">📦</div>
            <div className="kpi-label">Rendement Estimé</div>
            <div className="kpi-value">{loading ? '—' : crops.reduce((s, c) => s + c.estimatedYield, 0).toFixed(0)}<span className="kpi-unit">kg</span></div>
          </div>
        </div>

        {/* Table */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--green)' }}></div>Cultures Enregistrées</div>
            <div className="panel-action" onClick={fetchData} style={{ cursor: 'pointer' }}>↺ Actualiser</div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Chargement…</div>
            ) : crops.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{pageIcon}</div>
                <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Aucune culture enregistrée</div>
                <button onClick={openCreate} style={{ marginTop: '16px', padding: '8px 20px', background: 'rgba(90,158,69,0.15)', border: '1px solid rgba(90,158,69,0.4)', borderRadius: '8px', color: 'var(--green2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>➕ Ajouter la première culture</button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Culture</th><th>Catégorie</th><th>Parcelle</th><th>Plantation</th><th>Récolte Prévue</th><th>Rendement (kg)</th><th>Statut</th><th></th></tr>
                </thead>
                <tbody>
                  {crops.map(c => (
                    <tr key={c._id}>
                      <td>{pageIcon} {c.name}</td>
                      <td style={{ color: 'var(--text3)', fontSize: '12px' }}>{CATEGORY_LABEL[c.category] || c.category}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{c.plotId}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{new Date(c.plantedDate).toLocaleDateString('fr-FR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{c.expectedHarvestDate ? new Date(c.expectedHarvestDate).toLocaleDateString('fr-FR') : '—'}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green2)' }}>{c.estimatedYield}</td>
                      <td><span className={`pill ${STATUS_MAP[c.status]?.pill || 'pill-green'}`}>{STATUS_MAP[c.status]?.label || c.status}</span></td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {c.status === 'READY' && (
                          <button onClick={() => { setHarvestModal(c._id); setActualYield(String(c.estimatedYield)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginRight: '6px' }} title="Récolter">🌾</button>
                        )}
                        <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '14px', marginRight: '6px' }} title="Modifier">✏️</button>
                        <button onClick={() => setDeleteId(c._id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '14px' }} title="Supprimer">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Formulaire */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border2)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--cream)' }}>{editingId ? '✏️ Modifier' : '➕ Nouvelle Culture'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nom de la culture *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Tomates, Menthe, Basilic…" required />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="VEGETABLE">Légumes & Fruits</option>
                    <option value="HERB">Herbes & Aromates</option>
                    <option value="NURSERY">Pépinière</option>
                    <option value="FOREST">Forêt</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Identifiant Parcelle *</label>
                  <input value={form.plotId} onChange={e => setForm(f => ({ ...f, plotId: e.target.value }))} placeholder="Ex: P1, Zone-Nord…" required />
                </div>
                <div className="form-group">
                  <label>Date de Plantation *</label>
                  <input type="date" value={form.plantedDate} onChange={e => setForm(f => ({ ...f, plantedDate: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Récolte Prévue</label>
                  <input type="date" value={form.expectedHarvestDate} onChange={e => setForm(f => ({ ...f, expectedHarvestDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Rendement Estimé (kg)</label>
                  <input type="number" title="Rendement estimé" value={form.estimatedYield} onChange={e => setForm(f => ({ ...f, estimatedYield: e.target.value }))} min={0} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Surface (ha)</label>
                  <input type="number" title="Surface en ha" value={form.surface} onChange={e => setForm(f => ({ ...f, surface: e.target.value }))} min={0} step={0.01} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select title="Statut de la culture" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="PLANTED">Planté</option>
                    <option value="GROWING">En croissance</option>
                    <option value="READY">Prêt à récolter</option>
                    <option value="HARVESTED">Récolté</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observations, traitements, conditions…" rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Annuler</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '12px', background: 'rgba(90,158,69,0.2)', border: '1px solid rgba(90,158,69,0.4)', borderRadius: '10px', color: 'var(--green2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '1px', fontWeight: 700 }}>
                  {saving ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Récolte */}
      {harvestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--green)', borderRadius: '16px', padding: '28px', maxWidth: '360px', width: '100%' }}>
            <h3 style={{ color: 'var(--cream)', marginBottom: '16px' }}>🌾 Enregistrer la Récolte</h3>
            <div className="form-group">
              <label>Rendement Réel (kg)</label>
              <input type="number" value={actualYield} onChange={e => setActualYield(e.target.value)} min={0} autoFocus />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setHarvestModal(null)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text2)', cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleHarvest} style={{ flex: 1, padding: '10px', background: 'rgba(90,158,69,0.2)', border: '1px solid rgba(90,158,69,0.4)', borderRadius: '8px', color: 'var(--green2)', cursor: 'pointer', fontWeight: 700 }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Suppression */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--red)', borderRadius: '16px', padding: '28px', maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ color: 'var(--cream)', marginBottom: '8px' }}>Confirmer la suppression</h3>
            <p style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '24px' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text2)', cursor: 'pointer' }}>Annuler</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '10px', background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)', borderRadius: '8px', color: '#e87070', cursor: 'pointer', fontWeight: 700 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

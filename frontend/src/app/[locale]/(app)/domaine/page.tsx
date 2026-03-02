'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { infrastructureApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Infrastructure {
  _id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  value?: number;
  notes?: string;
}

interface InfraForm {
  name: string;
  type: string;
  status: string;
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  value: number | string;
  notes: string;
}

const EMPTY_FORM: InfraForm = {
  name: '', type: 'BUILDING', status: 'OPERATIONAL', location: '',
  lastMaintenance: '', nextMaintenance: '', value: '', notes: ''
};

const TYPE_LABEL: Record<string, string> = {
  BUILDING: 'Bâtiment',
  EQUIPMENT: 'Équipement',
  WELL: 'Puits / Eau',
  FENCE: 'Clôture',
  ROAD: 'Route / Chemin',
  OTHER: 'Autre',
};

const STATUS_MAP: Record<string, { label: string; pill: string }> = {
  OPERATIONAL:  { label: 'Opérationnel', pill: 'pill-green' },
  MAINTENANCE:  { label: 'En maintenance', pill: 'pill-blue' },
  DAMAGED:      { label: 'Endommagé', pill: 'pill-red' },
  CONSTRUCTION: { label: 'En construction', pill: 'pill-gold' },
};

export default function DomainePage() {
  const [items, setItems] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InfraForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await infrastructureApi.getAll() as any;
      setItems(res?.data || []);
    } catch {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (item: Infrastructure) => {
    setForm({
      name: item.name, type: item.type, status: item.status, location: item.location,
      lastMaintenance: item.lastMaintenance?.split('T')[0] || '',
      nextMaintenance: item.nextMaintenance?.split('T')[0] || '',
      value: item.value || '', notes: item.notes || ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: form.value ? Number(form.value) : undefined,
        lastMaintenance: form.lastMaintenance || undefined,
        nextMaintenance: form.nextMaintenance || undefined,
      };
      if (editingId) {
        await infrastructureApi.update(editingId, payload);
        toast.success('Mis à jour');
      } else {
        await infrastructureApi.create(payload);
        toast.success('Ajouté');
      }
      closeModal();
      fetchData();
    } catch {
      toast.error('Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await infrastructureApi.delete(id);
      toast.success('Supprimé');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <div className="page active" id="page-domaine">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div className="page-label" style={{ color: 'var(--brown)' }}>Infrastructure</div>
            <h1 className="page-title">Domaine &amp; Patrimoine</h1>
            <div className="page-sub">Gestion des bâtiments, équipements et installations du domaine</div>
          </div>
          <button onClick={openCreate} style={{ padding: '10px 20px', background: 'rgba(200,146,26,0.15)', border: '1px solid rgba(200,146,26,0.4)', borderRadius: '10px', color: 'var(--gold2)', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
            ➕ Ajouter un élément
          </button>
        </div>

        <div className="kpi-grid kpi-grid-4" style={{ marginBottom: '24px' }}>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--brown)' } as React.CSSProperties}>
            <div className="kpi-icon">🏗️</div>
            <div className="kpi-label">Éléments Total</div>
            <div className="kpi-value">{loading ? '—' : items.length}</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--green)' } as React.CSSProperties}>
            <div className="kpi-icon">✅</div>
            <div className="kpi-label">Opérationnels</div>
            <div className="kpi-value">{loading ? '—' : items.filter(i => i.status === 'OPERATIONAL').length}</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--red)' } as React.CSSProperties}>
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-label">En Panne / Alerte</div>
            <div className="kpi-value">{loading ? '—' : items.filter(i => i.status === 'DAMAGED').length}</div>
          </div>
          <div className="kpi-card" style={{ '--kpi-color': 'var(--blue)' } as React.CSSProperties}>
            <div className="kpi-icon">🔧</div>
            <div className="kpi-label">À Maintenir</div>
            <div className="kpi-value">{loading ? '—' : items.filter(i => i.status === 'MAINTENANCE').length}</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot" style={{ background: 'var(--brown)' }}></div>Inventaire du Domaine</div>
            <div className="panel-action" onClick={fetchData} style={{ cursor: 'pointer' }}>↺ Actualiser</div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Chargement…</div>
            ) : items.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏚️</div>
                <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Aucun élément enregistré</div>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Nom</th><th>Type</th><th>Emplacement</th><th>Valeur (DH)</th><th>Statut</th><th>Dernière Maint.</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i._id}>
                      <td style={{ fontWeight: 700 }}>{i.name}</td>
                      <td style={{ color: 'var(--text3)', fontSize: '12px' }}>{TYPE_LABEL[i.type] || i.type}</td>
                      <td>{i.location}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{i.value?.toLocaleString('fr-FR') || '—'}</td>
                      <td><span className={`pill ${STATUS_MAP[i.status]?.pill || 'pill-green'}`}>{STATUS_MAP[i.status]?.label || i.status}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{i.lastMaintenance ? new Date(i.lastMaintenance).toLocaleDateString('fr-FR') : '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => openEdit(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginRight: '8px' }}>✏️</button>
                        <button onClick={() => setDeleteId(i._id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border2)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--cream)' }}>{editingId ? '✏️ Modifier' : '➕ Ajouter un élément'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nom de l&apos;installation *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Hangar A1, Puits Nord…" required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select title="Type d'infrastructure" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {Object.entries(TYPE_LABEL).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Emplacement *</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Zone, parcelle…" required />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select title="Statut de l'installation" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {Object.entries(STATUS_MAP).map(([val, cfg]) => <option key={val} value={val}>{cfg.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Valeur estimée (DH)</label>
                  <input type="number" title="Valeur en DH" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} min={0} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Dernière Maintenance</label>
                  <input type="date" title="Date dernière maintenance" value={form.lastMaintenance} onChange={e => setForm(f => ({ ...f, lastMaintenance: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Prochaine Maintenance</label>
                  <input type="date" title="Date prochaine maintenance" value={form.nextMaintenance} onChange={e => setForm(f => ({ ...f, nextMaintenance: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observations, détails techniques…" rows={3} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text2)', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '12px', background: 'rgba(200,146,26,0.15)', border: '1px solid rgba(200,146,26,0.4)', borderRadius: '10px', color: 'var(--gold2)', cursor: 'pointer', fontWeight: 700 }}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--red)', borderRadius: '16px', padding: '28px', maxWidth: '380px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--cream)', marginBottom: '24px' }}>Confirmer la suppression ?</h3>
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

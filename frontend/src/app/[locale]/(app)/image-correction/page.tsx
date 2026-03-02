'use client';

import React, { useState, useCallback } from 'react';
import AnnotationCanvas, { Annotation } from '@/components/AnnotationCanvas';
import toast from 'react-hot-toast';

const IA_API     = process.env.NEXT_PUBLIC_IA_URL     || 'http://localhost:5001';
const BACKEND    = process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:2065';

export default function ImageCorrectionPage() {
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [imageUrl,    setImageUrl]    = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [saved,       setSaved]       = useState(false);

  // Charger depuis fichier local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnnotations([]);
    setSaved(false);
  };

  // Auto-analyse via service IA Python (YOLO)
  const handleAutoDetect = useCallback(async () => {
    if (!imageFile && !imageUrl) { toast.error('Chargez une image d\'abord'); return; }
    setAnalyzing(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        const blob = await fetch(imageUrl).then(r => r.blob());
        formData.append('image', blob, 'image.jpg');
      }
      const res = await fetch(`${IA_API}/analyze-image`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Erreur IA: ${res.status}`);

      const data: Array<{ label: string; confidence: number; bbox: { x: number; y: number; width: number; height: number } }> = await res.json();
      const aiAnnotations: Annotation[] = data.map(d => ({
        label: d.label, confidence: d.confidence, bbox: d.bbox, source: 'ai',
      }));
      setAnnotations(aiAnnotations);
      toast.success(`${aiAnnotations.length} objet(s) détecté(s)`);
    } catch (err) {
      console.error('[ImageCorrection] Auto-detect error:', err);
      toast.error('Erreur lors de l\'analyse IA');
    } finally {
      setAnalyzing(false);
    }
  }, [imageFile, imageUrl]);

  const handleAnnotationAdd = (ann: Annotation) => {
    setAnnotations(prev => [...prev, ann]);
    setSaved(false);
  };

  const handleDelete = (index: number) => {
    setAnnotations(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const handleSave = async () => {
    if (annotations.length === 0) { toast.error('Aucune annotation à sauvegarder'); return; }
    try {
      await fetch(`${BACKEND}/api/image-annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, annotations, savedAt: new Date().toISOString() }),
      });
      setSaved(true);
      toast.success('Annotations sauvegardées');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="page active">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <div className="page-label">IA · Vision Agricole</div>
          <h1 className="page-title">📷 Correction Visuelle</h1>
          <div className="page-sub">Détection automatique YOLO + annotation manuelle</div>
        </div>
      </div>

      <div className="content-grid cg-21" style={{ gap: '16px' }}>

        {/* ── Zone canvas principale ── */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><div className="dot"></div>Canvas d&apos;annotation</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAutoDetect}
                disabled={!imageUrl || analyzing}
                style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: imageUrl ? 'pointer' : 'not-allowed', background: 'rgba(90,158,69,0.12)', border: '1px solid rgba(90,158,69,0.3)', color: 'var(--green2)', opacity: !imageUrl ? 0.5 : 1 }}
              >
                {analyzing ? '⏳ Analyse...' : '🤖 Auto-Analyser'}
              </button>
              <button
                onClick={handleSave}
                disabled={annotations.length === 0}
                style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', background: saved ? 'rgba(90,158,69,0.2)' : 'rgba(58,122,184,0.12)', border: `1px solid ${saved ? 'rgba(90,158,69,0.4)' : 'rgba(58,122,184,0.3)'}`, color: saved ? 'var(--green2)' : 'var(--blue)', opacity: annotations.length === 0 ? 0.5 : 1 }}
              >
                {saved ? '✅ Sauvegardé' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '16px' }}>
            {/* Upload */}
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}>
                📁 Charger image
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <span style={{ color: 'var(--text3)', fontSize: '12px' }}>
                {imageFile?.name || 'Aucun fichier sélectionné'}
              </span>
            </div>

            {imageUrl ? (
              <AnnotationCanvas
                src={imageUrl}
                annotations={annotations}
                onAnnotationAdd={handleAnnotationAdd}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: '8px', color: 'var(--text3)', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '32px' }}>📷</span>
                <span>Chargez une image pour commencer</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Liste annotations ── */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot" style={{ background: 'var(--green2)' }}></div>
              Annotations ({annotations.length})
            </div>
          </div>
          <div className="panel-body" style={{ padding: '12px' }}>
            {annotations.length === 0 ? (
              <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '30px', fontSize: '13px', lineHeight: '1.8' }}>
                Lancez l&apos;analyse IA<br />ou dessinez sur l&apos;image
              </div>
            ) : (
              <div>
                {annotations.map((ann, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>
                        <span style={{ marginRight: '6px' }}>{ann.source === 'ai' ? '🤖' : '✏️'}</span>
                        {ann.label}
                      </div>
                      {ann.confidence != null && (
                        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          Confiance : {(ann.confidence * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(i)}
                      style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '18px', padding: '0 4px', lineHeight: 1 }}
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

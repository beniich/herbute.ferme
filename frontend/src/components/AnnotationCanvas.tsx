'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

export interface BBox { x: number; y: number; width: number; height: number; }
export interface Annotation {
  label: string;
  confidence?: number;
  bbox: BBox;
  source: 'ai' | 'manual';
}

interface Props {
  src: string;
  annotations: Annotation[];
  onAnnotationAdd?: (ann: Annotation) => void;
}

const COLORS: Record<Annotation['source'], string> = {
  ai:     '#22c55e',
  manual: '#f59e0b',
};

export default function AnnotationCanvas({ src, annotations, onAnnotationAdd }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);
  const drawStart  = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [scale,     setScale]     = useState({ x: 1, y: 1 });

  // Charger l'image et redimensionner le canvas
  useEffect(() => {
    if (!src) return;
    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      if (canvasRef.current) {
        const maxW  = canvasRef.current.parentElement?.clientWidth || 800;
        const ratio = Math.min(maxW / img.naturalWidth, 1);
        canvasRef.current.width  = img.naturalWidth  * ratio;
        canvasRef.current.height = img.naturalHeight * ratio;
        setScale({ x: ratio, y: ratio });
      }
      setImgLoaded(true);
    };
    img.onerror = () => console.error('[AnnotationCanvas] Failed to load image:', src);
    img.src = src;
  }, [src]);

  // Redessiner image + toutes les annotations
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const ann of annotations) {
      const { x, y, width, height } = ann.bbox;
      const sx = x * scale.x, sy = y * scale.y;
      const sw = width * scale.x, sh = height * scale.y;
      const color = COLORS[ann.source];

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2;
      ctx.strokeRect(sx, sy, sw, sh);

      // Label background
      const label = ann.confidence != null
        ? `${ann.label} (${(ann.confidence * 100).toFixed(0)}%)`
        : ann.label;
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      const textW = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(sx, sy - 18, textW + 8, 18);

      // Label text
      ctx.fillStyle = '#000';
      ctx.fillText(label, sx + 4, sy - 5);
    }
  }, [annotations, scale]);

  useEffect(() => { if (imgLoaded) redraw(); }, [imgLoaded, redraw]);

  // ─── Dessin manuel ───────────────────────────────────────────────────────
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onAnnotationAdd) return;
    drawStart.current = getPos(e);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart.current) return;
    redraw();
    const ctx = canvasRef.current!.getContext('2d')!;
    const cur = getPos(e);
    ctx.strokeStyle = COLORS.manual;
    ctx.lineWidth   = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(
      drawStart.current.x, drawStart.current.y,
      cur.x - drawStart.current.x, cur.y - drawStart.current.y
    );
    ctx.setLineDash([]);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart.current || !onAnnotationAdd) return;
    const end = getPos(e);
    const x = Math.min(drawStart.current.x, end.x);
    const y = Math.min(drawStart.current.y, end.y);
    const w = Math.abs(end.x - drawStart.current.x);
    const h = Math.abs(end.y - drawStart.current.y);

    if (w > 10 && h > 10) {
      const label = prompt('Label pour cette annotation :') || 'unknown';
      onAnnotationAdd({
        label,
        source: 'manual',
        bbox: { x: x / scale.x, y: y / scale.y, width: w / scale.x, height: h / scale.y },
      });
    }
    drawStart.current = null;
    setIsDrawing(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {!imgLoaded && src && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text3)' }}>
          Chargement de l&apos;image...
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: '100%',
          cursor: onAnnotationAdd ? 'crosshair' : 'default',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          display: imgLoaded ? 'block' : 'none',
        }}
      />
    </div>
  );
}

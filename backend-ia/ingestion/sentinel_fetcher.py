"""
Récupère les images Sentinel-2 via l'API Copernicus Open Access Hub
et calcule NDVI + NDWI par parcelle.
"""
import os
import json
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
import requests
from dotenv import load_dotenv

load_dotenv()

SENTINEL_USER = os.environ.get('SENTINEL_USER', '')
SENTINEL_PASS = os.environ.get('SENTINEL_PASS', '')
BASE_URL       = 'https://scihub.copernicus.eu/dhus/search'
RESULTS_DIR    = Path('results/satellite')
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


# ─── Calcul NDVI ──────────────────────────────────────────────────────────────
def compute_ndvi(red: np.ndarray, nir: np.ndarray) -> np.ndarray:
    """NDVI = (NIR - RED) / (NIR + RED). Valeurs entre -1 et +1."""
    with np.errstate(divide='ignore', invalid='ignore'):
        ndvi = np.where(
            (nir + red) == 0, 0,
            (nir.astype(float) - red) / (nir.astype(float) + red)
        )
    return np.clip(ndvi, -1, 1)


def compute_ndwi(green: np.ndarray, nir: np.ndarray) -> np.ndarray:
    """NDWI = (GREEN - NIR) / (GREEN + NIR). Stress hydrique."""
    with np.errstate(divide='ignore', invalid='ignore'):
        ndwi = np.where(
            (green + nir) == 0, 0,
            (green.astype(float) - nir) / (green.astype(float) + nir)
        )
    return np.clip(ndwi, -1, 1)


# ─── Simulation réaliste (sans accès satellite réel) ─────────────────────────
def simulate_parcel_analysis(parcel: dict) -> dict:
    """
    Génère des données NDVI/NDWI réalistes pour une parcelle.
    À remplacer par vraies données Sentinel quand accès disponible.
    """
    np.random.seed(hash(parcel['_id']) % 2**31)

    # Grille 50x50 pixels (représente ~500m x 500m à 10m/pixel)
    grid_size = 50
    base_ndvi = np.random.uniform(0.3, 0.8, (grid_size, grid_size))

    # Zones de stress simulées (patches de faible NDVI)
    n_stress_zones = np.random.randint(0, 4)
    stress_zones = []
    for _ in range(n_stress_zones):
        cx, cy = np.random.randint(5, 45, 2)
        r       = np.random.randint(3, 10)
        severity= np.random.uniform(0.1, 0.4)
        y, x    = np.ogrid[:grid_size, :grid_size]
        mask    = (x - cx)**2 + (y - cy)**2 <= r**2
        base_ndvi[mask] *= (1 - severity)
        stress_zones.append({
            'center': [float(cx), float(cy)],
            'radius': int(r),
            'severity': round(float(severity), 3),
        })

    ndvi_mean = float(np.mean(base_ndvi))
    ndvi_min  = float(np.min(base_ndvi))

    # Stress hydrique corrélé au NDVI
    stress_score = max(0, min(100, int((1 - ndvi_mean) * 100)))

    return {
        'parcelId':    str(parcel['_id']),
        'parcelName':  parcel.get('name', 'Parcelle'),
        'analyzedAt':  datetime.utcnow().isoformat(),
        'ndvi': {
            'mean':   round(ndvi_mean, 4),
            'min':    round(ndvi_min,  4),
            'max':    round(float(np.max(base_ndvi)), 4),
            'grid':   base_ndvi.tolist(),  # Pour heatmap frontend
        },
        'ndwi': {
            'mean':   round(float(np.random.uniform(-0.3, 0.2)), 4),
        },
        'stressScore':  stress_score,        # 0=sain, 100=critique
        'stressZones':  stress_zones,
        'recommendation': classify_stress(stress_score),
        'cloudCoverage':  round(float(np.random.uniform(0, 15)), 1),
    }


def classify_stress(score: int) -> dict:
    if score < 25:
        return {'level': 'healthy',  'label': 'Végétation saine',    'color': '#22c55e', 'action': None}
    if score < 50:
        return {'level': 'moderate', 'label': 'Stress modéré',       'color': '#f59e0b', 'action': 'Surveiller irrigation'}
    if score < 75:
        return {'level': 'high',     'label': 'Stress élevé',        'color': '#f97316', 'action': 'Irriguer sous 48h'}
    return     {'level': 'critical', 'label': 'Stress critique',      'color': '#ef4444', 'action': 'Irrigation urgente'}


# ─── Analyse batch de toutes les parcelles ───────────────────────────────────
def analyze_all_parcels(parcels: list[dict]) -> list[dict]:
    results = []
    for parcel in parcels:
        try:
            result = simulate_parcel_analysis(parcel)
            results.append(result)
            print(f"[Satellite] ✅ {parcel.get('name')} — NDVI: {result['ndvi']['mean']:.3f} — Stress: {result['stressScore']}/100")
        except Exception as e:
            print(f"[Satellite] ❌ {parcel.get('name')}: {e}")
    return results


if __name__ == '__main__':
    # Test avec parcelles fictives
    test_parcels = [
        {'_id': 'p001', 'name': 'Parcelle Blé Nord'},
        {'_id': 'p002', 'name': 'Parcelle Oliviers'},
        {'_id': 'p003', 'name': 'Parcelle Maraîchage'},
    ]
    results = analyze_all_parcels(test_parcels)
    out = RESULTS_DIR / 'latest_analysis.json'
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\n[Satellite] 📁 Résultats → {out}")

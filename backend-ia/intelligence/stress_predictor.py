"""
Modèle Random Forest pour prédire le stress hydrique.
Entraîné sur NDVI + données IoT + météo.
"""
import json
import pickle
import numpy as np
from pathlib import Path
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

MODELS_DIR = Path('models/ml')
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def generate_training_data(n_samples: int = 5000) -> tuple:
    """
    Génère données d'entraînement synthétiques basées sur
    relations agronomiques réelles NDVI/stress.
    À enrichir avec vos vraies données historiques.
    """
    np.random.seed(42)
    X, y = [], []

    for _ in range(n_samples):
        # Features
        ndvi           = np.random.uniform(0.1, 0.9)
        soil_moisture  = np.random.uniform(10, 80)     # %
        air_temp       = np.random.uniform(15, 45)     # °C
        air_humidity   = np.random.uniform(20, 90)     # %
        days_no_rain   = np.random.randint(0, 30)
        soil_temp      = air_temp * 0.7 + np.random.normal(0, 2)
        conductivity   = np.random.uniform(0.5, 3.0)
        light          = np.random.uniform(0, 1000)

        features = [
            ndvi, soil_moisture, air_temp, air_humidity,
            days_no_rain, soil_temp, conductivity, light,
        ]

        # Target : stress 0-100 (relations agronomiques)
        stress  = 0
        stress += max(0, (0.4 - ndvi) * 80)           # NDVI bas → stress
        stress += max(0, (25 - soil_moisture) * 1.5)  # Sol sec → stress
        stress += max(0, (days_no_rain - 7) * 2.5)    # Pas de pluie → stress
        stress += max(0, (air_temp - 35) * 3)         # Chaleur → stress
        stress  = min(100, max(0, stress + np.random.normal(0, 5)))

        X.append(features)
        y.append(stress)

    return np.array(X), np.array(y)


def train_model() -> dict:
    """Entraîne et sauvegarde le modèle Random Forest."""
    print("[ML] 🔄 Génération données d'entraînement...")
    X, y = generate_training_data(5000)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Normalisation
    scaler  = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    # Modèle Random Forest
    print("[ML] 🌲 Entraînement Random Forest...")
    rf = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    rf.fit(X_train, y_train)

    # Évaluation
    y_pred = rf.predict(X_test)
    mae    = mean_absolute_error(y_test, y_pred)
    r2     = r2_score(y_test, y_pred)
    print(f"[ML] ✅ MAE: {mae:.2f} | R²: {r2:.4f}")

    # Sauvegarde
    pickle.dump(rf,     open(MODELS_DIR / 'stress_rf.pkl', 'wb'))
    pickle.dump(scaler, open(MODELS_DIR / 'scaler.pkl',    'wb'))

    metrics = {'mae': round(mae, 3), 'r2': round(r2, 4), 'trainedAt': datetime.utcnow().isoformat()}
    (MODELS_DIR / 'metrics.json').write_text(json.dumps(metrics, indent=2))

    return metrics


def predict_stress(features: dict) -> dict:
    """
    Prédit le score de stress pour une parcelle.
    features: { ndvi, soilMoisture, airTemp, airHumidity,
                daysNoRain, soilTemp, conductivity, light }
    """
    try:
        rf     = pickle.load(open(MODELS_DIR / 'stress_rf.pkl', 'rb'))
        scaler = pickle.load(open(MODELS_DIR / 'scaler.pkl',    'rb'))
    except FileNotFoundError:
        print("[ML] ⚠️ Modèle absent — entraînement automatique...")
        train_model()
        return predict_stress(features)

    X = np.array([[
        features.get('ndvi',          0.5),
        features.get('soilMoisture',  40),
        features.get('airTemp',       25),
        features.get('airHumidity',   60),
        features.get('daysNoRain',    0),
        features.get('soilTemp',      20),
        features.get('conductivity',  1.2),
        features.get('light',         500),
    ]])

    X_scaled     = scaler.transform(X)
    stress_score = float(np.clip(rf.predict(X_scaled)[0], 0, 100))
    confidence   = float(np.std([t.predict(X_scaled)[0] for t in rf.estimators_[:20]]))

    return {
        'stressScore': round(stress_score, 1),
        'confidence':  round(max(0, 100 - confidence * 2), 1),
        'level':       _stress_level(stress_score),
        'predictedAt': datetime.utcnow().isoformat(),
    }


def _stress_level(score: float) -> str:
    if score < 25: return 'healthy'
    if score < 50: return 'moderate'
    if score < 75: return 'high'
    return 'critical'


if __name__ == '__main__':
    metrics = train_model()
    print(f"\n[ML] Métriques: {metrics}")

    # Test prédiction
    test = predict_stress({'ndvi': 0.35, 'soilMoisture': 18, 'airTemp': 38, 'daysNoRain': 12})
    print(f"[ML] Test prédiction: {test}")

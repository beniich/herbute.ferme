import os, json, uuid, logging
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(','))

from ingestion.sentinel_fetcher     import analyze_all_parcels, classify_stress
from intelligence.stress_predictor  import predict_stress, train_model
from intelligence.recommendation_engine import generate_recommendations

# ─── Health ──────────────────────────────────────────────────────────────────
@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'herbute-ia', 'version': '1.0.0'})

# ─── Analyse satellite ────────────────────────────────────────────────────────
@app.route('/satellite/analyze', methods=['POST'])
def satellite_analyze():
    """Analyse NDVI/NDWI pour une liste de parcelles."""
    parcels = request.json.get('parcels', [])
    if not parcels:
        return jsonify({'error': 'parcels requis'}), 400
    results = analyze_all_parcels(parcels)
    return jsonify({'data': results, 'count': len(results)})

# ─── Prédiction stress ────────────────────────────────────────────────────────
@app.route('/predict/stress', methods=['POST'])
def predict_stress_route():
    """Prédit score de stress pour une parcelle via ML."""
    features = request.json
    if not features:
        return jsonify({'error': 'features requis'}), 400
    result = predict_stress(features)
    return jsonify(result)

# ─── Recommandations IA ───────────────────────────────────────────────────────
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Génère recommandations agronomiques via Claude."""
    parcel_data = request.json
    if not parcel_data:
        return jsonify({'error': 'parcel_data requis'}), 400
    result = generate_recommendations(parcel_data)
    return jsonify(result)

# ─── Pipeline complet ─────────────────────────────────────────────────────────
@app.route('/analyze/full', methods=['POST'])
def full_analysis():
    """
    Pipeline complet: satellite + IoT + ML + recommandations.
    Body: { parcel: {...}, iotReadings: {...}, weather: {...} }
    """
    body    = request.json or {}
    parcel  = body.get('parcel', {})
    iot     = body.get('iotReadings', {})
    weather = body.get('weather', {})

    # 1. Analyse satellite
    [satellite] = analyze_all_parcels([parcel])

    # 2. Prédiction ML avec données combinées
    ml_features = {
        'ndvi':          satellite['ndvi']['mean'],
        'soilMoisture':  iot.get('soilMoisture', 40),
        'airTemp':       iot.get('airTemperature', 25) or weather.get('temperature', 25),
        'airHumidity':   iot.get('airHumidity', 60),
        'daysNoRain':    weather.get('daysNoRain', 0),
        'soilTemp':      iot.get('soilTemperature', 20),
        'conductivity':  iot.get('conductivity', 1.2),
        'light':         iot.get('lightIntensity', 500),
    }
    ml_prediction = predict_stress(ml_features)

    # 3. Données enrichies pour recommandations
    enriched = {
        **satellite,
        **ml_features,
        'stressScore':  ml_prediction['stressScore'],
        'cropType':     parcel.get('cropType'),
        'cropStage':    parcel.get('cropStage'),
        'forecast':     weather.get('forecast'),
        'daysNoRain':   weather.get('daysNoRain', 0),
    }

    # 4. Recommandations IA
    recommendations = generate_recommendations(enriched)

    return jsonify({
        'parcelId':       parcel.get('_id'),
        'satellite':      satellite,
        'mlPrediction':   ml_prediction,
        'recommendations':recommendations,
        'analyzedAt':     datetime.utcnow().isoformat(),
    })

# ─── Entraînement modèle ──────────────────────────────────────────────────────
@app.route('/model/train', methods=['POST'])
def retrain_model():
    """Ré-entraîne le modèle ML (à appeler quand nouvelles données disponibles)."""
    metrics = train_model()
    return jsonify({'message': 'Modèle entraîné', 'metrics': metrics})

if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    log.info(f'🚀 Herbute IA Service → port {port}')
    app.run(host='0.0.0.0', port=port, debug=debug)

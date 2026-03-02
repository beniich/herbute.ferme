import os
import uuid
import logging
from pathlib import Path
from flask import Flask, request, jsonify

# Logging structuré
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
log = logging.getLogger(__name__)

app = Flask(__name__)

UPLOAD_FOLDER = Path('uploads')
MODELS_FOLDER = Path('models')
UPLOAD_FOLDER.mkdir(exist_ok=True)
MODELS_FOLDER.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB max

# ─── Chargement du modèle YOLO ───────────────────────────────────────────────
model = None

def load_model():
    global model
    model_path = MODELS_FOLDER / 'best.pt'
    try:
        from ultralytics import YOLO
        if model_path.exists():
            model = YOLO(str(model_path))
            log.info(f'✅ Modèle chargé: {model_path}')
        else:
            # Fallback: modèle générique pré-entraîné
            model = YOLO('yolov8n.pt')
            log.warning('⚠️  best.pt introuvable — utilisation de yolov8n.pt (générique)')
    except Exception as e:
        log.error(f'❌ Erreur chargement modèle: {e}')
        model = None

load_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────
def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def run_detection(image_path: str, conf_threshold: float = 0.25) -> list:
    """Retourne une liste de détections: label, confidence, bbox."""
    if model is None:
        raise RuntimeError("Modèle YOLO non chargé")

    results = model.predict(source=image_path, save=False, conf=conf_threshold, verbose=False)
    detections = []

    for result in results:
        for box in result.boxes:
            cls_id     = int(box.cls[0])
            label      = model.names[cls_id]
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "label":      label,
                "confidence": round(confidence, 4),
                "bbox": {
                    "x":      round(x1, 2),
                    "y":      round(y1, 2),
                    "width":  round(x2 - x1, 2),
                    "height": round(y2 - y1, 2),
                }
            })

    return detections


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status":       "ok",
        "model_loaded": model is not None,
        "model_path":   str(MODELS_FOLDER / 'best.pt'),
    })


@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    """Reçoit une image, lance la détection YOLO et retourne les résultats."""
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image fournie (field: 'image')"}), 400

    file = request.files['image']
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": f"Format non supporté. Autorisés: {ALLOWED_EXTENSIONS}"}), 400

    # UUID pour éviter les collisions de noms de fichiers
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = UPLOAD_FOLDER / filename

    try:
        file.save(str(filepath))
        log.info(f'Image reçue: {filepath.name}')

        conf = float(request.form.get('confidence', 0.25))
        detections = run_detection(str(filepath), conf_threshold=conf)

        log.info(f'Détections: {len(detections)} objet(s)')
        return jsonify(detections)

    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        log.error(f'Erreur analyse: {e}')
        return jsonify({"error": "Erreur interne lors de l'analyse"}), 500
    finally:
        # Nettoyage immédiat du fichier temporaire
        if filepath.exists():
            filepath.unlink()


@app.route('/models', methods=['GET'])
def list_models():
    """Liste les modèles .pt disponibles dans le dossier models/."""
    models_list = [f.name for f in MODELS_FOLDER.glob('*.pt')]
    return jsonify({"models": models_list})


# ─── Démarrage ────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    log.info(f'🚀 Service IA démarré sur port {port} (debug={debug})')
    app.run(host='0.0.0.0', port=port, debug=debug)

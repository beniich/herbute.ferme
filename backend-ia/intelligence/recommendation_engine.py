"""
Moteur de recommandations IA basé sur Anthropic Claude.
Génère des recommandations agronomiques personnalisées.
"""
import os
import json
from datetime import datetime
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY', ''))

AGRO_SYSTEM_PROMPT = """
Tu es un expert agronome spécialisé en agriculture marocaine avec 20 ans d'expérience.
Tu analyses des données de capteurs IoT, images satellite NDVI, et météo pour donner
des recommandations précises et actionnables.

Règles :
- Recommandations concrètes, pas de généralités
- Quantifier quand possible (litres/ha, kg/ha, jours)
- Prioriser par urgence (critique/urgent/normal/préventif)
- Adapter au contexte Maroc (climat semi-aride, culture locale)
- Répondre UNIQUEMENT en JSON valide, aucun texte autour
"""

def generate_recommendations(parcel_data: dict) -> dict:
    """
    Génère des recommandations IA pour une parcelle.
    parcel_data: données combinées satellite + IoT + météo
    """
    prompt = f"""
Analyse ces données de la parcelle "{parcel_data.get('parcelName', 'Parcelle')}" 
et génère des recommandations agronomiques.

DONNÉES SATELLITE:
- NDVI moyen: {parcel_data.get('ndvi', {}).get('mean', 'N/A')}
- Score stress hydrique: {parcel_data.get('stressScore', 'N/A')}/100
- Zones de stress détectées: {len(parcel_data.get('stressZones', []))}

DONNÉES CAPTEURS IoT:
- Humidité sol: {parcel_data.get('soilMoisture', 'N/A')}%
- Température air: {parcel_data.get('airTemp', 'N/A')}°C
- Conductivité: {parcel_data.get('conductivity', 'N/A')} mS/cm
- pH sol: {parcel_data.get('ph', 'N/A')}

MÉTÉO:
- Jours sans pluie: {parcel_data.get('daysNoRain', 'N/A')}
- Prévisions 7j: {parcel_data.get('forecast', 'Non disponible')}

CULTURE:
- Type: {parcel_data.get('cropType', 'Non spécifié')}
- Stade: {parcel_data.get('cropStage', 'Non spécifié')}

Réponds UNIQUEMENT avec ce JSON:
{{
  "summary": "Résumé en 1-2 phrases de l'état général",
  "urgencyLevel": "critical|high|medium|low",
  "recommendations": [
    {{
      "category": "irrigation|fertilisation|traitement|surveillance|récolte",
      "priority": "immédiate|48h|7j|préventif",
      "title": "Titre court",
      "action": "Action précise et quantifiée",
      "reason": "Pourquoi cette action",
      "quantity": "Quantité si applicable (ex: 25mm/ha)",
      "deadline": "Délai (ex: Avant jeudi)"
    }}
  ],
  "nextAnalysisIn": "24h|48h|7j",
  "confidence": 85
}}
"""

    try:
        response = client.messages.create(
            model='claude-sonnet-4-20250514',
            max_tokens=1000,
            system=AGRO_SYSTEM_PROMPT,
            messages=[{'role': 'user', 'content': prompt}],
        )
        raw  = response.content[0].text.strip()
        data = json.loads(raw)
        data['generatedAt'] = datetime.utcnow().isoformat()
        data['parcelId']    = parcel_data.get('parcelId')
        return data

    except json.JSONDecodeError:
        return _fallback_recommendation(parcel_data)
    except Exception as e:
        print(f"[Reco] ❌ Erreur API: {e}")
        return _fallback_recommendation(parcel_data)


def _fallback_recommendation(parcel_data: dict) -> dict:
    """Recommandations règles simples si API indisponible."""
    stress = parcel_data.get('stressScore', 50)
    recs   = []

    if stress > 75:
        recs.append({'category': 'irrigation', 'priority': 'immédiate',
                     'title': 'Irrigation urgente', 'action': 'Irriguer 30-40mm/ha',
                     'reason': f'Score stress critique: {stress}/100', 'deadline': 'Aujourd\'hui'})
    elif stress > 50:
        recs.append({'category': 'irrigation', 'priority': '48h',
                     'title': 'Irrigation recommandée', 'action': 'Irriguer 20-25mm/ha',
                     'reason': f'Score stress élevé: {stress}/100', 'deadline': 'Dans 48h'})

    soil_moisture = parcel_data.get('soilMoisture', 40)
    if soil_moisture and soil_moisture < 20:
        recs.append({'category': 'surveillance', 'priority': '48h',
                     'title': 'Sol très sec', 'action': 'Vérifier système irrigation',
                     'reason': f'Humidité sol: {soil_moisture}%', 'deadline': 'Dans 48h'})

    return {
        'summary':       f"Analyse automatique — stress {stress}/100",
        'urgencyLevel':  'critical' if stress > 75 else 'high' if stress > 50 else 'medium',
        'recommendations': recs,
        'nextAnalysisIn':  '24h',
        'confidence':      60,
        'generatedAt':     datetime.utcnow().isoformat(),
        'parcelId':        parcel_data.get('parcelId'),
        'fallback':        True,
    }


if __name__ == '__main__':
    # Test
    test_data = {
        'parcelId': 'p001', 'parcelName': 'Parcelle Blé Nord',
        'ndvi': {'mean': 0.32}, 'stressScore': 72, 'stressZones': [{}],
        'soilMoisture': 18, 'airTemp': 36, 'conductivity': 0.9, 'ph': 6.8,
        'daysNoRain': 14, 'cropType': 'Blé tendre', 'cropStage': 'Tallage',
    }
    result = generate_recommendations(test_data)
    print(json.dumps(result, indent=2, ensure_ascii=False))

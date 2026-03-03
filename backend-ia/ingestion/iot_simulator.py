"""
Simule des capteurs IoT (sol, humidité, température) via MQTT.
À remplacer par vrais capteurs physiques (ESP32, Arduino, LoRa).
"""
import json
import time
import random
import math
from datetime import datetime
import paho.mqtt.client as mqtt
from dotenv import load_dotenv
import os

load_dotenv()

BROKER_HOST = os.environ.get('MQTT_HOST', 'localhost')
BROKER_PORT = int(os.environ.get('MQTT_PORT', '1883'))
TOPIC_BASE  = 'herbute/sensors'

# Configuration des capteurs simulés
SENSORS = [
    { 'id': 'sensor-p001-01', 'parcelId': 'p001', 'name': 'Parcelle Blé Nord — Zone A', 'lat': 33.9716, 'lng': -6.8498 },
    { 'id': 'sensor-p001-02', 'parcelId': 'p001', 'name': 'Parcelle Blé Nord — Zone B', 'lat': 33.9720, 'lng': -6.8502 },
    { 'id': 'sensor-p002-01', 'parcelId': 'p002', 'name': 'Parcelle Oliviers',           'lat': 33.9680, 'lng': -6.8550 },
    { 'id': 'sensor-p003-01', 'parcelId': 'p003', 'name': 'Parcelle Maraîchage',         'lat': 33.9750, 'lng': -6.8470 },
]

def generate_reading(sensor: dict, tick: int) -> dict:
    """Génère une lecture réaliste avec variation diurne."""
    hour = datetime.now().hour
    # Température : pic à 14h
    temp_base  = 22 + 8 * math.sin((hour - 6) * math.pi / 12)
    # Humidité sol : baisse dans la journée, remonte la nuit
    humidity   = 45 - 15 * math.sin((hour - 6) * math.pi / 12)
    # Légère dérive par capteur
    seed_offset = hash(sensor['id']) % 100 / 100

    return {
        'sensorId':     sensor['id'],
        'parcelId':     sensor['parcelId'],
        'sensorName':   sensor['name'],
        'location':     {'lat': sensor['lat'], 'lng': sensor['lng']},
        'timestamp':    datetime.utcnow().isoformat() + 'Z',
        'readings': {
            'soilMoisture':    round(humidity + seed_offset * 5 + random.gauss(0, 1.5), 2),  # %
            'soilTemperature': round(temp_base * 0.7 + seed_offset * 2 + random.gauss(0, 0.5), 2),  # °C
            'airTemperature':  round(temp_base + seed_offset + random.gauss(0, 0.8), 2),  # °C
            'airHumidity':     round(60 - temp_base * 0.8 + random.gauss(0, 2), 2),  # %
            'lightIntensity':  round(max(0, 800 * math.sin((hour - 6) * math.pi / 12) + random.gauss(0, 50)), 1),  # lux
            'conductivity':    round(1.2 + seed_offset * 0.8 + random.gauss(0, 0.1), 3),  # mS/cm
            'ph':              round(6.5 + seed_offset * 0.8 + random.gauss(0, 0.1), 2),
            'batteryLevel':    round(95 - tick * 0.01 + seed_offset * 5, 1),  # %
        },
        'status': 'online',
    }

def main():
    client = mqtt.Client(client_id='iot-simulator')
    try:
        client.connect(BROKER_HOST, BROKER_PORT, 60)
        client.loop_start()
        print(f"[IoT] ✅ Connecté à MQTT {BROKER_HOST}:{BROKER_PORT}")
    except Exception as e:
        print(f"[IoT] ❌ MQTT indisponible ({e}) — mode dry-run")
        client = None

    tick = 0
    while True:
        for sensor in SENSORS:
            reading = generate_reading(sensor, tick)
            topic   = f"{TOPIC_BASE}/{sensor['parcelId']}/{sensor['id']}"
            payload = json.dumps(reading)

            if client:
                client.publish(topic, payload, qos=1)

            print(f"[IoT] 📡 {sensor['name'][:30]:<30} — Sol: {reading['readings']['soilMoisture']:.1f}% — T°: {reading['readings']['airTemperature']:.1f}°C")

        tick += 1
        time.sleep(30)  # Toutes les 30 secondes

if __name__ == '__main__':
    main()

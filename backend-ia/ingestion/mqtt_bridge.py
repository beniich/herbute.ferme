"""
Reçoit les messages MQTT des capteurs et les persiste dans MongoDB.
"""
import json
import os
from datetime import datetime
import paho.mqtt.client as mqtt
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

load_dotenv()

MONGO_URI   = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/herbute')
BROKER_HOST = os.environ.get('MQTT_HOST', 'localhost')
BROKER_PORT = int(os.environ.get('MQTT_PORT', '1883'))

# Connexion MongoDB
mongo  = MongoClient(MONGO_URI)
db     = mongo['herbute']
col    = db['sensor_readings']

# Index pour requêtes IoT dashboard
col.create_index([('sensorId', ASCENDING), ('timestamp', ASCENDING)])
col.create_index([('parcelId', ASCENDING), ('timestamp', ASCENDING)])
col.create_index('timestamp', expireAfterSeconds=30 * 24 * 3600)  # TTL 30 jours

def on_connect(client, userdata, flags, rc):
    print(f"[Bridge] ✅ Connecté MQTT (rc={rc})")
    client.subscribe('herbute/sensors/#', qos=1)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        payload['_receivedAt'] = datetime.utcnow()
        col.insert_one(payload)
        print(f"[Bridge] 💾 {payload.get('sensorId')} sauvegardé")
    except Exception as e:
        print(f"[Bridge] ❌ Erreur: {e}")

def main():
    client = mqtt.Client(client_id='mqtt-bridge')
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    print(f"[Bridge] 🔌 Démarrage — écoute sur herbute/sensors/#")
    client.loop_forever()

if __name__ == '__main__':
    main()

// Initialisation MongoDB — exécuté au premier démarrage
db = db.getSiblingDB('herbute');

// Utilisateur applicatif (moins de droits que root)
db.createUser({
  user: 'herbute_app',
  pwd:  'herbute_app_2025',
  roles: [{ role: 'readWrite', db: 'herbute' }],
});

// Collections initiales + indexes critiques
db.createCollection('crops');
db.createCollection('animals');
db.createCollection('transactions');
db.createCollection('sensor_readings');
db.createCollection('analysis_reports');
db.createCollection('parcels');

// Index sensor_readings (IoT — forte volumétrie)
db.sensor_readings.createIndex({ sensorId: 1, timestamp: 1 });
db.sensor_readings.createIndex({ parcelId: 1, timestamp: 1 });
db.sensor_readings.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // TTL 30j

// Index crops
db.crops.createIndex({ organizationId: 1, status: 1 });
db.crops.createIndex({ organizationId: 1, category: 1 });
db.crops.createIndex({ organizationId: 1, createdAt: -1 });

// Index animals
db.animals.createIndex({ organizationId: 1, species: 1 });
db.animals.createIndex({ organizationId: 1, health: 1 });
db.animals.createIndex({ 'vaccinations.nextDue': 1 });

// Index transactions
db.transactions.createIndex({ organizationId: 1, date: -1 });
db.transactions.createIndex({ organizationId: 1, type: 1, date: -1 });
db.transactions.createIndex({ organizationId: 1, sector: 1, date: -1 });

// Index analysis_reports
db.analysis_reports.createIndex({ organizationId: 1, createdAt: -1 });
db.analysis_reports.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL 90j

print('✅ Herbute MongoDB initialisé');

import { Crop } from '../modules/agro/crops.model.js';
import { Animal } from '../modules/agro/animals.model.js';
import InventoryItem from '../models/InventoryItem.js';
import Attendance from '../models/Attendance.js';
import AIPrediction from '../models/AIPrediction.js';
import OpenAI from 'openai';
import notificationService from './socketService.js';


const ollama = new OpenAI({
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama-local',
});

export class PredictiveAnalysisService {
  /**
   * Run full predictive analysis for an organization
   */
  async runGlobalAnalysis(organizationId: string) {
    const [crops, animals, inventory, attendances] = await Promise.all([
      Crop.find({ organizationId }).sort({ updatedAt: -1 }).limit(20).lean(),
      Animal.find({ organizationId }).sort({ updatedAt: -1 }).limit(20).lean(),
      InventoryItem.find({ organizationId, currentStock: { $lt: 20 } }).limit(15).lean(),
      Attendance.find({ organizationId }).sort({ createdAt: -1 }).limit(30).lean(),
    ]);

    const context = {
      crops: crops.map(c => ({ name: c.name, status: c.status, yield: c.estimatedYield })),
      animals: animals.map(a => ({ type: a.type, status: a.status, count: a.count })),
      lowStocks: inventory.map(i => ({ name: i.name, qty: i.currentStock, min: i.minThreshold })),
      recentAttendances: attendances.map(a => ({ status: a.status, date: a.date })),
    };

    const prompt = `
      Tu es un expert en analyse de risques agricoles pour Herbute.
      Analyse ces données et prédis les événements critiques pour les 7 prochains jours.
      
      DONNÉES :
      ${JSON.stringify(context)}
      
      FORMAT DE RÉPONSE (JSON uniquement) :
      {
        "predictions": [
          {
            "type": "stock" | "yield" | "hr" | "maintenance",
            "severity": "low" | "medium" | "high",
            "description": "Explication courte en français",
            "probability": 0.95,
            "actionRequired": "Conseil d'action"
          }
        ]
      }
    `;

    try {
      const response = await ollama.chat.completions.create({
        model: 'llama3.1',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      // Persist predictions and notify if urgent
      for (const pred of result.predictions || []) {
        await AIPrediction.create({
          organizationId,
          domainId: organizationId,
          type: pred.type,
          target: 'Global Dashboard',
          predictionData: pred,
          confidence: pred.probability * 100,
          modelUsed: 'llama3.1-predictive-v1'
        });

        if (pred.severity === 'high') {
          notificationService.notifyAIAlert(organizationId, pred);
        }
      }

      return result;
    } catch (err: any) {
      console.error('[Predictive] Analysis failed:', err.message);
      return { error: 'Analysis failed' };
    }
  }
}

export const predictiveService = new PredictiveAnalysisService();

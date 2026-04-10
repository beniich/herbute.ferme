import AIConversation from '../models/AIConversation.js';
import AIPrediction from '../models/AIPrediction.js';
import Attendance from '../models/Attendance.js';
import InventoryItem from '../models/InventoryItem.js';
import OpenAI from 'openai';

// Initialisation du client compatible OpenAI pointant vers notre Ollama Docker interne
const ollamaAgent = new OpenAI({
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama-local', // Une clé factice suffit en local
});

export class AIService {
  public async generateChatResponse(userId: string, message: string, conversationId?: string) {
    let conversation;

    // 1. Récupération ou création du contexte de la discussion
    if (conversationId) {
      conversation = await AIConversation.findById(conversationId);
      if (!conversation) throw new Error('Conversation not found');
    } else {
      conversation = new AIConversation({
        userId,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [{ 
          role: 'system', 
          content: "Tu es le nouvel assistant IA exclusif de direction de l'ERP Herbute. Tu aides les dirigeants à suivre l'entreprise en analysant rapidement la base de données. Sois toujours professionnel, concis, et base tes réponses uniquement sur les données renvoyées par tes appels de fonctions." 
        }],
      });
    }

    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });

    // On formate l'historique pour le SDK OpenAI
    const messageHistory = conversation.messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    // 2. Définition des "Outils" (Tools) que l'IA peut appeler
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_recent_attendances',
          description: "Obtient les dernières données de présence et d'absence du personnel",
          parameters: { type: 'object', properties: {} }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_inventory_status',
          description: "Vérifie l'inventaire et signale uniquement les articles en rupture de stock ou niveau bas",
          parameters: { type: 'object', properties: {} }
        }
      }
    ];

    try {
      // 3. Premier appel au modèle (Phase de réflexion)
      console.log('🤖 Agent IA réfléchit sur la requête : ', message);
      const response = await ollamaAgent.chat.completions.create({
        model: 'llama3.1', // Modèle qui tournera via Docker
        messages: messageHistory as any,
        tools: tools as any
      });

      let aiMessage = response.choices[0].message;

      // 4. Si l'IA décide d'utiliser un outil (Interrogation bases de données !)
      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        messageHistory.push(aiMessage as any); // On ajoute l'intention de l'IA à l'historique interne

        // L'IA peut appeler plusieurs outils en même temps
        for (const toolCall of aiMessage.tool_calls) {
          console.log(`🔌 Agent IA exécute l'outil interne : ${toolCall.function.name}`);
          let functionResponse = '';

          if (toolCall.function.name === 'get_recent_attendances') {
            const attendances = await Attendance.find().sort({ createdAt: -1 }).limit(10);
            functionResponse = JSON.stringify(attendances.length ? attendances : "Rien à signaler concernant les présences aujourd'hui.");
          } 
          else if (toolCall.function.name === 'get_inventory_status') {
            // on cible potentiellement les stocks critiques
            const items = await InventoryItem.find({ currentStock: { $lt: 10 } }).limit(10);
            functionResponse = JSON.stringify(items.length ? items : "Inventaire nominal, pas d'alertes en dessous de 10 unités.");
          }

          // On renvoie le résultat de la fonction à l'IA
          messageHistory.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: functionResponse
          } as any);
        }

        // 5. Deuxième appel au modèle (Phase de synthèse avec les données)
        console.log('📝 Agent IA analyse les données retournées par ses outils et rédige...');
        const finalResponse = await ollamaAgent.chat.completions.create({
          model: 'llama3.1',
          messages: messageHistory as any
        });
        
        aiMessage = finalResponse.choices[0].message;
      }

      // Sauvegarde du succès
      conversation.messages.push({ role: 'assistant', content: aiMessage.content, timestamp: new Date() });
      conversation.tokensUsed += 250;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      return conversation;

    } catch (err: any) {
      console.error('Erreur Serveur IA Local :', err.message);
      conversation.messages.push({ 
        role: 'assistant', 
        content: "⚠️ Erreur technique : L'assistant n'a pas pu joindre Ollama. Assurez-vous que le conteneur Docker `ollama` est allumé et que le modèle `llama3.1` y est installé.", 
        timestamp: new Date() 
      });
      await conversation.save();
      return conversation;
    }
  }

  public async generatePrediction(domainId: string, type: 'yield' | 'disease' | 'weather_impact', target: string) {
    let predictionData;
    let confidence = 85 + Math.random() * 10;
    let modelUsed = 'agromaitre-mock-v1';

    try {
      const IA_URL = process.env.INTERNAL_IA_URL || 'http://localhost:5001';
      // Import axios locally to avoid affecting top-level imports if not needed, or assume it's available.
      // But we should use typical dynamic import or global fetch to avoid requiring 'axios' if it's not in package.json.
      
      const payload = {
        parcel: {
            _id: target,
            cropType: target,
            cropStage: "development"
        },
        weather: {
            temperature: type === 'weather_impact' ? 35 : 25,
            daysNoRain: type === 'weather_impact' ? 14 : 3
        }
      };

      const response = await fetch(`${IA_URL}/analyze/full`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Python service returned ${response.status}`);
      }

      const result = await response.json();
      predictionData = result;
      confidence = 94.5;
      modelUsed = 'agromaitre-python-v1';

    } catch (err) {
      console.warn('⚠️ Python IA service unreachable, falling back to mock data:', err);
      // Fallback to static mock data if python container is off
      predictionData = this.getMockPredictionData(type, target);
      modelUsed = 'agromaitre-fallback-mock';
    }
    
    const prediction = new AIPrediction({
      domainId,
      type,
      target,
      predictionData,
      confidence,
      modelUsed,
    });

    await prediction.save();
    return prediction;
  }

  private getMockResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('météo') || q.includes('pluie')) {
      return "Les prévisions indiquent une probabilité de pluie de 60% dans les 48 prochaines heures. Il est conseillé de reporter les traitements phytosanitaires.";
    }
    if (q.includes('maladie') || q.includes('champignon')) {
      return "D'après les symptômes décrits, il pourrait s'agir de mildiou. Pouvez-vous fournir une photo ou plus de détails sur l'aspect des feuilles ?";
    }
    if (q.includes('récolte') || q.includes('rendement')) {
      return "Le modèle prédictif estime le rendement de la parcelle à 4.5 tonnes par hectare cette saison, en légère hausse par rapport à l'année dernière.";
    }
    return "Je suis à votre disposition pour vous aider dans la gestion de votre exploitation agricole. Que puis-je faire pour vous aujourd'hui ?";
  }

  private getMockPredictionData(type: string, _target: string) {
    switch (type) {
      case 'yield':
        return {
          estimatedYield: '4.5 t/ha',
          variance: '+/- 0.3 t/ha',
          factors: ['Température optimale (+15%)', 'Irrigation régulière (+5%)']
        };
      case 'disease':
        return {
          riskLevel: 'Moyen',
          pathogen: 'Oïdium',
          probability: '65%',
          recommendation: 'Traitement préventif au soufre sous 48h'
        };
      case 'weather_impact':
        return {
          alert: 'Gel tardif potentiel',
          affectedArea: 'Parcelles Nord',
          mitigation: 'Préparer les systèmes anti-gel'
        };
      default:
        return { status: 'ok', detail: 'Analysis complete.' };
    }
  }
}

export const aiService = new AIService();

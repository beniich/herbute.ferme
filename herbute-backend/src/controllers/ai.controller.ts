import { Request, Response } from 'express';
import { aiService } from '../services/ai.service.js';
import AIConversation from '../models/AIConversation.js';
import AIPrediction from '../models/AIPrediction.js';

// @desc    Send a message to AI assistant
// @route   POST /api/ai/chat
// @access  Private
export const chat = async (req: any, res: Response) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id || req.user._id;
    const organizationId = req.organizationId || req.user.organizationId;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message requis' });
    }

    const conversation = await aiService.generateChatResponse(userId, organizationId, message, conversationId);

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's AI conversations
// @route   GET /api/ai/conversations
// @access  Private
export const getConversations = async (req: any, res: Response) => {
  try {
    const userId = req.user.id || req.user._id;
    const organizationId = req.organizationId || req.user.organizationId;
    
    const conversations = await AIConversation.find({ userId, organizationId })
      .sort({ updatedAt: -1 })
      .select('-messages')
      .limit(30);

    res.status(200).json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a prediction 
// @route   POST /api/ai/predict
// @access  Private
export const predict = async (req: Request, res: Response) => {
  try {
    const { type, target, domainId } = req.body;
    // user ID can be verified here

    if (!type || !target || !domainId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type, target, and domainId are required' 
      });
    }

    const prediction = await aiService.generatePrediction(domainId, type, target);

    res.status(201).json({
      success: true,
      data: prediction
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get previous predictions 
// @route   GET /api/ai/predictions
// @access  Private
export const getPredictions = async (req: any, res: Response) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { domainId } = req.query;
    
    const query: any = { organizationId };
    if (domainId) query.domainId = domainId;

    const predictions = await AIPrediction.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: predictions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run global dashboard predictive analysis
// @route   POST /api/ai/analyze-global
// @access  Private
export const analyzeGlobal = async (req: any, res: Response) => {
  try {
    const organizationId = req.organizationId || req.user.organizationId;
    const { predictiveService } = await import('../services/predictiveAnalysis.service.js');
    
    const result = await predictiveService.runGlobalAnalysis(organizationId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

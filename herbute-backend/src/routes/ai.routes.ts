import express from 'express';
import { chat, getConversations, predict, getPredictions, analyzeGlobal } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Apply auth middleware to all AI routes
router.use(authenticate);

router.post('/chat', chat);
router.get('/conversations', getConversations);
router.post('/predict', predict);
router.get('/predictions', getPredictions);
router.post('/analyze-global', analyzeGlobal);

export default router;


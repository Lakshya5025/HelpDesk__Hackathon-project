import express from 'express';
import { getAgents, createAgent } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/agents', protect, getAgents);
router.post('/create-agent', protect, admin, createAgent);

export default router;
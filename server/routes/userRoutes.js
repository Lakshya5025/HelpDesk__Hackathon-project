import express from 'express';
import { getAgents } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/agents', protect, getAgents);

export default router;
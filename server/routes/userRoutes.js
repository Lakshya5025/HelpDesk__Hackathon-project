import express from 'express';
import { getAgents } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected, only logged-in users can see the agent list
router.get('/agents', protect, getAgents);

export default router;
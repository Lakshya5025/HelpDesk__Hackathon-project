import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    addComment
} from '../controllers/ticketController.js';

const router = express.Router();

router.use(protect);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id', updateTicket);
router.post('/:id/comments', addComment);

export default router;
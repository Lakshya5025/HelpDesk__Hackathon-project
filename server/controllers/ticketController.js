import Ticket from '../models/ticketModel.js';
import User from '../models/userModel.js';


export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        const user = req.user._id;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.' });
        }

        const ticket = await Ticket.create({ user, title, description });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getTickets = async (req, res) => {
    try {
        // Basic pagination
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const tickets = await Ticket.find({ user: req.user._id })
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });

        res.status(200).json({
            items: tickets,
            next_offset: offset + tickets.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        if (ticket.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const updateTicket = async (req, res) => {
    try {
        const { status, assignedTo, version } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        if (version !== undefined && ticket.version !== version) {
            return res.status(409).json({ message: 'Conflict: Ticket has been modified by someone else. Please refresh and try again.' });
        }

        if (assignedTo && !['agent', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to assign tickets.' });
        }

        ticket.status = status || ticket.status;
        ticket.assignedTo = assignedTo || ticket.assignedTo;

        const updatedTicket = await ticket.save();
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        const comment = {
            text,
            user: req.user._id,
        };

        ticket.comments.push(comment);
        await ticket.save();

        res.status(201).json(ticket.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
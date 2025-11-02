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
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        let query = {};
        if (req.user.role === 'agent') {
            query.$or = [
                { assignedTo: req.user._id },
                { assignedTo: null }
            ];
        } else if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }

        const tickets = await Ticket.find(query)
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


        const isOwner = ticket.user.toString() === req.user._id.toString();
        const isAgent = req.user.role === 'agent';
        const isAdmin = req.user.role === 'admin'
        if (ticket.assignedTo && isAgent && ticket.assignedTo.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (!isOwner && !isAgent && !isAdmin) {
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
            return res.status(409).json({ message: 'Conflict: Ticket has been modified. Please refresh.' });
        }

        if (assignedTo) {
            if (req.user.role === 'admin') {
                ticket.assignedTo = assignedTo;
            }
            else if (req.user.role === 'agent') {
                if (assignedTo !== req.user._id.toString()) {
                    return res.status(403).json({ message: 'Agents can only assign tickets to themselves.' });
                }
                ticket.assignedTo = assignedTo;
            }
            else {
                return res.status(403).json({ message: 'Not authorized to assign tickets.' });
            }
        }

        ticket.status = status || ticket.status;

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
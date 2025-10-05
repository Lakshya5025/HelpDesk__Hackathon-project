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


// ... (imports and other functions)

export const getTickets = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        // --- LOGIC CHANGE IS HERE ---
        let query = {}; // Start with an empty query to get all tickets

        // If the user is NOT an agent or admin, restrict the query to their own tickets
        if (req.user.role !== 'agent' && req.user.role !== 'admin') {
            query.user = req.user._id;
        }

        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
            ];
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

// ... (rest of the functions)


// ... (other functions)

export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        // --- LOGIC CHANGE IS HERE ---
        // Allow access if the user is an agent/admin OR if they own the ticket
        const isOwner = ticket.user.toString() === req.user._id.toString();
        const isAgentOrAdmin = req.user.role === 'agent' || req.user.role === 'admin';

        if (!isOwner && !isAgentOrAdmin) {
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

        // Optimistic Locking Check
        if (version !== undefined && ticket.version !== version) {
            return res.status(409).json({ message: 'Conflict: Ticket has been modified. Please refresh.' });
        }

        // --- NEW ASSIGNMENT LOGIC ---
        if (assignedTo) {
            // An admin can assign to anyone.
            if (req.user.role === 'admin') {
                ticket.assignedTo = assignedTo;
            }
            // An agent can ONLY assign a ticket to themselves.
            else if (req.user.role === 'agent') {
                if (assignedTo !== req.user._id.toString()) {
                    return res.status(403).json({ message: 'Agents can only assign tickets to themselves.' });
                }
                ticket.assignedTo = assignedTo;
            }
            // A regular user cannot assign tickets.
            else {
                return res.status(403).json({ message: 'Not authorized to assign tickets.' });
            }
        }

        // Update status if provided
        ticket.status = status || ticket.status;

        const updatedTicket = await ticket.save();
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ... (rest of the controller is the same)


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
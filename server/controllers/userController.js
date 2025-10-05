import User from '../models/userModel.js';

export const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: { $in: ['agent', 'admin'] } }).select('name _id');
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const createAgent = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        if (role !== 'agent' && role !== 'admin') {
            return res.status(400).json({ message: 'Invalid role specified. Can only create "agent" or "admin".' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
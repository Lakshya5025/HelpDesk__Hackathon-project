import User from '../models/userModel.js';

export const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: { $in: ['agent', 'admin'] } }).select('name _id');
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};



export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user._id);
        res.cookie('token', token, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000
        }).status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password required" });
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { _id, name, role } = user;
            const token = generateToken(user._id);
            res.cookie('token', token, {
                sameSite: 'strict',
                maxAge: 10 * 24 * 60 * 60 * 1000
            }).status(200).json({
                _id, name, email, role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
export const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

export const logout = (req, res) => {
    return res
        .clearCookie("token")
        .status(200)
        .json({ message: "Logout successful." });
}
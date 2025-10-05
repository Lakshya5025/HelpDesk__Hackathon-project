import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'agent', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);


const User = mongoose.model('User', userSchema);

export default User;
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, process.env.SALT);
});


const User = mongoose.model('User', userSchema);

export default User;
import * as dotenv from "dotenv";
dotenv.config();
import apiLimiter from './middleware/rateLimiter.js';
import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { idempotencyCheck } from './middleware/idempotencyMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import userRouter from "./routes/userRoutes.js";
const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(idempotencyCheck);
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);


app.use('/api/', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});




async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on ${process.env.SERVER_URL}`);
        });
    } catch (err) {
        console.error("Failed to connect to the database:");
        console.error(err);
        process.exit(1);
    }
}

startServer();

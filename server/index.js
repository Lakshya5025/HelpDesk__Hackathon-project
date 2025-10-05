import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);



app.use('/api/auth', authRoutes);
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

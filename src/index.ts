import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import {connectDb} from './db';
// Pick up the configs from the .env file
dotenv.config();

// Setup Express
const app = express();
// Set the port for the server
const  port = process.env.PORT;

//Connect to DB
connectDb();

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' ,uptime: process.uptime() });
});

// Start the server listening at port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
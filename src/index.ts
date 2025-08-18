import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import {connectDb} from './db';
import notesRouter from './routes/notes';
import healthRouter from './routes/health';

// Pick up the configs from the .env file
dotenv.config();

// Setup Express
const app = express();
// Set the port for the server
const  port = process.env.PORT;

app.use(express.json());

// API routes
app.use('/api/notes', notesRouter);
app.use('/api/health', healthRouter);

async function start(){
    // Connect to the database
    await connectDb();
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

start();
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import {connectDb} from './db';
import notesRouter from './routes/notes';
import healthRouter from './routes/health';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// Pick up the configs from the .env file
dotenv.config();

// Setup Express
const app = express();
// Set the port for the server
const  port = process.env.PORT;
const openapiPath = path.resolve(process.cwd(), 'docs/openapi.json');
const openapiSpec = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/docs.json', (_req, res) => res.json(openapiSpec));


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
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const  port = process.env.PORT;

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' ,uptime: process.uptime() });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
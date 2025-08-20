import {ZodType} from 'zod';
// Middleware to validate request body using Zod schemas
import { Request, Response, NextFunction} from 'express';

// Validate function middleware to validate the schema before processing the request
export const validate = (schema: ZodType<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));      
            return res.status(400).json({ error: 'Validation failed', details });
        }
        req.body = result.data; 
        next();
    };
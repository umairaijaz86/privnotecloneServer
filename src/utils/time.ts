import dotenv from 'dotenv';

dotenv.config();

const defaultExpiry = process.env.DEFAULT_EXPIRY_MINUTES ? parseInt(process.env.DEFAULT_EXPIRY_MINUTES) : 60;

export const expiresAtFromMinutes = (minutes?: number): Date => {
    const m = typeof minutes == 'number' && minutes > 0 ? minutes : defaultExpiry; 
    return new Date(Date.now() + m * 60 * 1000);
}
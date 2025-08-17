import mongoose from 'mongoose';
import dotnev from 'dotenv';

//Pick up the environment variables from the .env file
dotnev.config();
const mongoUri = process.env.MONGO_URI as string;

//Connect to the MongoDB database
export const connectDb = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}
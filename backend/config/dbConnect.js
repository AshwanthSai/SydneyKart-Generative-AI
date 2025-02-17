import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });


/* 
- We have avoided the traditional, 
  callback-based approach to connect to MongoDB.
- It blocks the feedback loop and stops taking input via CLI
*/
export const connectDatabase = async () => {
  try {
    let DB_URI = "";
    
    if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
    if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

    // Add connection options with timeout
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000,        // Initial connection timeout
    };

    const con = await mongoose.connect(DB_URI, options);
    console.log(`MongoDB Database connected with HOST: ${con?.connection?.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);  // Exit with failure
  }
};
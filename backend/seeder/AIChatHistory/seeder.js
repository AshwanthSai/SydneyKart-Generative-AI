import mongoose from "mongoose"
import dotenv from "dotenv";
import Chat from "../../models/chatMessages.js";
import chatHistory from "./chat.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

const seedChatHistory = async() => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Database Connected")

        await Chat.deleteMany();
        console.log("Chat History Collection Cleared")

        // Add default user ID to all chat histories
        const chatsWithUser = chatHistory.map(chat => ({
            ...chat,
            user: new mongoose.Types.ObjectId("65f4f65b15d2c69f9f8b2c3d") // Replace with your admin user ID
        }));

        await Chat.insertMany(chatsWithUser, { validateBeforeSave: false })
        console.log("Chat History data inserted")

        process.exit();
    } catch(error) {
        console.error(error.message) 
        process.exit(1); // Added error code for failed execution
    }
}

seedChatHistory();
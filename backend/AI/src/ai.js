import OpenAI from 'openai'
import dotenv from "dotenv";

dotenv.config({ path: "../../backend/config/config.env" });


export const openai = new OpenAI()

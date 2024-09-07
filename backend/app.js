import express from "express"
const server = express();

import dotenv from "dotenv"
dotenv.config({path : "backend/config/.env"})

// Connect to DB
import { connectDB } from "./config/dbConnect.js";
connectDB();

//Parses data in Chunks and appends it to the Body
server.use(express.json())

//Import All Routes
import productRoutes from "./routes/products.js"

server.use("/api/v1",productRoutes)

server.listen(process.env.PORT, () => {
    console.log(`Server Listening ${process.env.PORT}, on ${process.env.NODE_ENV}`)
})


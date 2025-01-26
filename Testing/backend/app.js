import express from "express"
import dotenv from "dotenv"
// Connect to DB
import { connectDB } from "./config/dbConnect.js";
// Reading Cookies in Chunk and Appending to Req Body
import cookieParser from 'cookie-parser'
//Import All Routes
import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import orderRoutes from "./routes/order.js"
import { errorMiddleware } from "./middlewares/errors.js";
import { responseTracker } from "./middlewares/auth.js";
import {debugResponse} from "./controller/authControllers.js";

const app = express();

// Handling Unhandled Exception Error
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err}`)
    console.log(`Shutting down error due to Uncaught Exception`)
    process.exit(1)
})

process.on("unhandledRejection", (err) => {
    
    /*    console.log(`Error : ${err}`)
        console.log(`Server shutting down due to unhandled Rejection`) */
    /* 
        The  close  method stops the server from accepting new 
        connections and keeps existing connections open until 
        they are handled. This is important for gracefully 
        shutting down the server to avoid abruptly terminating 
        ongoing requests. 
    */
     /*  server.close(() => {
        process.exit(1)
    }) */
    // Get stack trace
    const stackLines = err.stack.split('\n');
    const errorLocation = stackLines[1]?.match(/\((.*):(\d+):(\d+)\)$/);
    
    console.log('ERROR 💥');
    console.log({
        name: err.name,
        message: err.message,
        location: errorLocation ? {
            file: errorLocation[1],
            line: errorLocation[2],
            column: errorLocation[3]
        } : 'Unknown location',
        fullStack: err.stack
    });

    // Ensure stack trace is captured
    Error.captureStackTrace(err, Error);
    
    server.close(() => {
        process.exit(1);
    });
})


// Pull all .env variables into process
dotenv.config({path : "backend/config/.env"})
connectDB();

// Parses data in Chunks and appends it to the Body
app.use(express.json())
// Read cookies send by req and append to req.cookies
app.use(cookieParser())

// Attaching Routes
app.use(debugResponse);
app.use("/api/v1",authRoutes)
app.use("/api/v1",productRoutes)
app.use("/api/v1",orderRoutes)

// Sanitizes the error and appends to req.error
app.use(errorMiddleware)

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Listening ${process.env.PORT}, on ${process.env.NODE_ENV}`)
})

// Handling unHandled Rejection




import express from "express"
const app = express();


import dotenv from "dotenv"
dotenv.config({path : "backend/config/.env"})

// Connect to DB
import { connectDB } from "./config/dbConnect.js";
connectDB();

//Parses data in Chunks and appends it to the Body
app.use(express.json())

//Import All Routes
import productRoutes from "./routes/products.js"
import { errorMiddleware } from "./middlewears/errors.js";

app.use("/api/v1",productRoutes)
/* 
If you attach to APP configuration, console.log will not pop up,
because it is a different process.
*/
app.use(errorMiddleware)

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Listening ${process.env.PORT}, on ${process.env.NODE_ENV}`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err}`)
    console.log(`Server shutting down due to unhandled Rejection`)
    /* 
        The  close  method stops the server from accepting new 
        connections and keeps existing connections open until 
        they are handled. This is important for gracefully 
        shutting down the server to avoid abruptly terminating 
        ongoing requests. 
    */
    server.close(() => {
        process.exit(1)
    })
})
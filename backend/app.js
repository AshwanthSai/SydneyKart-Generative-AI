import express from "express";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from 'cors'
import multer from "multer";
import dotenv from "dotenv";
import setupSocket from './routes/chat.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

const app = express();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB max file size
  }
});


// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

if(process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: join(__dirname, '../config/config.env') });
}

// Connecting to database
connectDatabase();


// Wildcard CORS policy is not accepted when using credentials, app.use(cors())
app.use(cors({
  origin: true,  // Allow any origin
  credentials: true
}));

//  The default req.body limit is 1mb, to bypass this.
//  We need to increase the limit.
app.use(
  express.json({ 
    limit: '50mb', 
    /* 
      Stores unparsed request body as string
      Required for Stripe webhook signature verification
      Must be set before any body parsing occurs
    */
    verify : (req, res, buf) => {
      req.rawBody = buf.toString()
    }
  })
);

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import { OpenAI } from "./controllers/AI_Controller.js";


app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);


// Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

/* Setting up Socket IO Server for AI Chat Assistant  */
const io = setupSocket(server);

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

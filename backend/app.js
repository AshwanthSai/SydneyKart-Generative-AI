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
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

const app = express();

/* 
  Prevent DDOS and Bots
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});

app.use(limiter)

/* 
  Compress responses for 
  -  Reduced Response Size 
  -  Reduced Bandwidth Usage
  -  Faster Page Load Times
*/
app.use(compression({
  level: 6, // Compression level (0-9, default: 6)
  threshold: 1024, // Only compress responses above 1KB
  memLevel: 8, // Memory level (1-9, default: 8)
  filter: function(req, res) {
    if (req.headers['upgrade'] === 'websocket') {
      return false;
    }
    // Don't compress already compressed content types
    const contentType = res.getHeader('Content-Type');
    if (contentType && (
      contentType.includes('image') ||
      contentType.includes('video') ||
      contentType.includes('audio') ||
      contentType.includes('application/octet-stream')
    )) {
      return false;
    }
    return compression.filter(req, res);
  }
}));



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

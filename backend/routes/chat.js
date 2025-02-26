import { Server } from 'socket.io';
import { invokeAI } from "../AI/index.js";
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const setupSocket = (server, userId) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://portfoliosai.link"],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["my-custom-header"],
    },
    /* 
      Server sends a ping every pingInterval (25s)
      Client must respond within pingTimeout (60s)
      If no response, connection is considered dead
      Server automatically closes dead connections
      Helps with
        - Resource Management
        - Connection Reliability
        - Performance
    */
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
  });


  // Middleware to extract and verify token from cookies
  io.use(async (socket, next) => {
    try {
      // Get token from cookies
      const token = socket.handshake.headers.cookie
        ?.split(';')
        ?.find(c => c.trim().startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('role email name').lean();
      const email = user?.email;
      const name = user?.name;
      const isAdmin = Boolean(user?.role === 'admin');
      decoded["isAdmin"] = isAdmin
      decoded["email"] = email
      decoded["name"] = name

      // Attach user data to socket
      socket.user = decoded;
      next();

    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("message", async (message) => {
      socket.emit("status", "Thinking ...")
      await invokeAI(message, socket)
    });

  });

  return io;
};

export default setupSocket;
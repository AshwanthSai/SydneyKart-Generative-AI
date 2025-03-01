import { Server } from 'socket.io';
import { invokeAI } from "../AI/index.js";
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import User from '../models/user.js';
import { logMessage } from '../AI/src/ui.js';

const setupSocket = (server, userId) => {
  const io = new Server(server, {
    path: '/socket.io/',
    cors: {
      origin: function(origin, callback) {
        console.log('Origin attempt:', origin);
        callback(null, origin || true);
      },
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["my-custom-header", "cookie"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    debug: true  // Enable debug mode
  });

  // Add connection error logging
  io.engine.on("connection_error", (err) => {
    console.log("Connection Error:", {
      code: err.code,
      message: err.message,
      context: err.context
    });
  });


  io.use((socket, next) => {
    console.log('Socket connection attempt:', {
      id: socket.id,
      handshake: {
        headers: socket.handshake.headers,
        query: socket.handshake.query,
        auth: socket.handshake.auth
      }
    });
    next();
  });

  // Middleware to extract and verify token from cookies
  io.use(async (socket, next) => {
    try {
      console.log('Headers:', socket.handshake.headers);
      // Get token from cookies
      const token = socket.handshake.headers.cookie
        ?.split(';')
        ?.find(c => c.trim().startsWith('token='))
        ?.split('=')[1];

      console.log('Token found:', !!token);
      
      if (!token) {
          logMessage({message: "Initiating non admin mode :)", socket})
      }

      if(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role email name').lean();
        const email = user?.email;
        const name = user?.name;
        const isAdmin = Boolean(user?.role === 'admin');
        decoded["isAdmin"] = isAdmin
        decoded["email"] = email
        decoded["name"] = name
        // Attach user data to socket
        console.log(decoded)
        socket.user = decoded;
      }

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
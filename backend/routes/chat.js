import { Server } from 'socket.io';
import { invokeAI } from "../AI/index.js";


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
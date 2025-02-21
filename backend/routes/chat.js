import { Server } from 'socket.io';
import { invokeAI } from "../AI/index.js";


const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://portfoliosai.link"],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["my-custom-header"],
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
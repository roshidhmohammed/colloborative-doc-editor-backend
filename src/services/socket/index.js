import { Server } from "socket.io";
import authorizeSocket from "./userAuth.js";
import registerSocketHandlers from "./handlers/index.js";
import { documentService } from "./handlers/fetchDocument.js";
import * as Y from "yjs";
import { documentManager } from "../yjs/documentManager.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  io.users = [];

  io.use(authorizeSocket(io));

  io.on("connection", (socket) => {
    console.log("Connected", socket.id);
    registerSocketHandlers(io, socket);
  });

  return io;
};

export default initializeSocket;

import { Server } from "socket.io";
import authorizeSocket from "./utils/userAuth.js";
import registerSocketHandlers from "./handlers/index.js";
// import { documentService } from "./handlers/fetchDocument.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(authorizeSocket);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
};

export default initializeSocket;

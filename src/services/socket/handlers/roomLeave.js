import { broadcastCollaborators } from "../utils/broadcastCollaborators.js";
import { removeUser } from "../utils/removeUser.js";


const registerRoomLeaveHandler = (io, socket) => {
  socket.on("document:leave",async (documentId) => {
    console.log("4 document:leave called")
    if (!documentId) return;

    socket.leave(documentId);
    removeUser(documentId, socket);
    await broadcastCollaborators(
        io,
        documentId
    );
  });
};

export default registerRoomLeaveHandler;

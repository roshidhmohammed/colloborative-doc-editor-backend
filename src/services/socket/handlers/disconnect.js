import { broadcastCollaborators } from "../utils/broadcastCollaborators.js";
import { removeUserFromAllDocuments } from "../utils/presenceManager.js";

const disconnectHandler = (io, socket) => {
  socket.on("disconnect", async(documentId) => {
    console.log("5 disconnect called")
    removeUserFromAllDocuments(socket);
    // console.log(socket.currentDocumentId, "disconnected")
    await broadcastCollaborators(
        io,
        documentId
    );
  });
};
export default disconnectHandler;

import { documentManager } from "../../yjs/documentManager.js";
import { documentService } from "../utils/fetchDocument.js";
import * as Y from "yjs";
import { addUser } from "../utils/addUser.js";
import { broadcastCollaborators } from "../utils/broadcastCollaborators.js";

const documentJoinHandler = (io, socket) => {
  socket.on("document:join", async (documentId) => {
    console.log("1 document:join called")
    socket.join(documentId);
    addUser(documentId, socket);
    await broadcastCollaborators(io, documentId);

    const managed = documentManager.get(documentId);

    if (!managed.initialized) {
      const dbDocument = await documentService.load(documentId);
      if (dbDocument?.content && dbDocument.content.length > 0) {
        const update = new Uint8Array(dbDocument.content);

        Y.applyUpdate(managed.ydoc, update);
      }

      managed.initialized = true;
    }

    const state = Y.encodeStateAsUpdate(managed.ydoc);

    socket.emit("document:load", state);
  });
};
export default documentJoinHandler;

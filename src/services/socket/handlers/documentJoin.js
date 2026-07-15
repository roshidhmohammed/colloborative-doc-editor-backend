import { documentManager } from "../../yjs/documentManager.js";
import { documentService } from "./fetchDocument.js";
import * as Y from "yjs";

const documentJoinHandler = (socket) => {
  socket.on("document:join", async (documentId) => {
    socket.join(documentId);
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

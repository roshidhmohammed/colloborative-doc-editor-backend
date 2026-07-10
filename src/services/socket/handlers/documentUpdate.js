import { documentManager } from "../../yjs/documentManager.js";
import { documentService } from "./fetchDocument.js";
import * as Y from "yjs";

const documentUpdateHandler = (socket) => {
  socket.on("document:update", async ({ documentId, content }, callback) => {
    const managed = documentManager.get(documentId);
    Y.applyUpdate(managed.ydoc, content);

    socket.to(documentId).emit("document:update", content);

    const state = Y.encodeStateAsUpdate(managed.ydoc);

    await documentService.save(documentId, state);

    callback({
      success: true,
      data: {
        id: documentId,
      },
    });
  });
};
export default documentUpdateHandler;

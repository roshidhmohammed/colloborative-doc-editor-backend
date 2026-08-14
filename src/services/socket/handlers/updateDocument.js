import * as Y from "yjs";
import { documentService } from "../utils/fetchDocument.js";
import { documentManager } from "../../yjs/documentManager.js";

const registerUpdateDocumentHandler = (socket) => {
  socket.on("document:update", async (payload = {}, callback) => {
    console.log(" 3 document:update called")
    try {
      const { documentId, content } = payload;
      const update = content instanceof Uint8Array ? content : new Uint8Array(content);

      const managed = documentManager.get(documentId);

      Y.applyUpdate(managed.ydoc, update);

      socket.to(documentId).emit("document:update", update);

      const state = Y.encodeStateAsUpdate(managed.ydoc);

      await documentService.save(documentId, state);

      callback?.({ success: true });
    } catch (error) {
      callback?.({ success: false, message: error.message });
    }
  });
};

export default registerUpdateDocumentHandler;

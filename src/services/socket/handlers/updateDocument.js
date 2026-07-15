import prisma from "../../../config/prisma.js";
import * as Y from "yjs";
import { documentService } from "./fetchDocument.js";
import { documentManager } from "../../yjs/documentManager.js";

const registerUpdateDocumentHandler = (socket) => {
  socket.on("document:update", async (payload = {}, callback) => {
    try {
      const { documentId, content } = payload;

      const managed = documentManager.get(documentId);

      Y.applyUpdate(managed.ydoc, update);

      socket.to(documentId).emit("document:update", update);

      const state = Y.encodeStateAsUpdate(managed.ydoc);

      await documentService.save(documentId, state);
    } catch (error) {
      callback?.({ success: false, message: error.message });
    }
  });
};

export default registerUpdateDocumentHandler;

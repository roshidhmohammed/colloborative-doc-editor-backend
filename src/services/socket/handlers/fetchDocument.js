import prisma from "../../../config/prisma.js";
import * as Y from "yjs";

import { documentManager } from "../../yjs/documentManager.js";

// db
export const documentService = {
  async load(documentId) {
    return await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      select: {
        id: true,
        content: true,
      },
    });
  },

  async save(documentId, content) {
    return await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        content: Buffer.from(content),
      },
    });
  },
};

const registerFetchDocumentHandler = (socket) => {
  socket.on("document:fetch", async (documentId, callback) => {
    try {
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

      console.log("Joined", documentId);
    } catch (error) {
      callback?.({ success: false, message: error.message });
    }
  });
};

export default registerFetchDocumentHandler;

import prisma from "../../../config/prisma.js";
import * as Y from "yjs";

import { documentManager } from "../../yjs/documentManager.js";

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

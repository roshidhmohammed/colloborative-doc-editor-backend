import  prisma  from "../../config/prisma.js";
import { generateShareToken } from "./shareToken.js";

export const createShareLink = async (documentId, createdById) => {
  const editorToken = generateShareToken();
  const viewerToken = generateShareToken();
  const ownerToken = generateShareToken();

    const ownerShareLink = await prisma.documentShareLink.create({
    data: {
      token: ownerToken,
      role: "OWNER",
      documentId,
      createdById,
    },
  });

  const editorShareLink = await prisma.documentShareLink.create({
    data: {
      token: editorToken,
      role: "EDITOR",
      documentId,
      createdById,
    },
  });

  const viewerShareLink = await prisma.documentShareLink.create({
    data: {
      token: viewerToken,
      role: "VIEWER",
      documentId,
      createdById,
    },
  });

  return {
    editorShareLink,
    viewerShareLink,
    ownerShareLink
  };
};

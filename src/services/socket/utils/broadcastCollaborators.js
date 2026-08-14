import prisma from "../../../config/prisma.js";
import { getDocumentPresence } from "./presenceManager.js";

export async function broadcastCollaborators(io, documentId) {
  

    const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    select: {
      creatorId: true,
      creator: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      collaborators: {
        orderBy: {
          joinedAt: "asc",
        },
        select: {
          id: true,
          documentId: true,
          userId: true,
          role: true,
          invitedBy: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      },
    },
  });

  
  if (!document) return;

  const presence = getDocumentPresence(documentId);

  const users = document.collaborators.map((c) => ({
    id: c.id,
    documentId: c.documentId,
    userId: c.userId,
    role: c.role,
    invitedBy: c.invitedBy,
    joinedAt: c.joinedAt,
    user: c.user,
    isCreator: c.userId === document.creatorId,
    onlineStatus: presence.has(c.userId)
      ? "online"
      : "offline",
  }));

  if (!users.some((x) => x.isCreator)) {
    users.unshift({
      id: null,
      documentId,
      userId: document.creator.id,
      role: "OWNER",
      invitedBy: null,
      joinedAt: null,
      user: document.creator,
      isCreator: true,
      onlineStatus: presence.has(document.creatorId)
        ? "online"
        : "offline",
    });
  }

  io.to(documentId).emit(
    "collaborator:presence",
    users
  );
}

import prisma from "../../../config/prisma.js";
import { getDocumentPresence } from "../utils/presenceManager.js";

const collaboratorOnlineStatusHandler = (io, socket) => {
  socket.on("collaborator:online-status", async (documentId, callback) => {

    console.log("2 collaborator:online-status called")
    try {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
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

      if (!document) {
        return callback?.({
          success: false,
          message: "Document not found",
        });
      }

      const presence = getDocumentPresence(documentId);

      const users = document.collaborators.map((collaborator) => ({
        id: collaborator.id,
        documentId: collaborator.documentId,
        userId: collaborator.userId,
        role: collaborator.role,
        invitedBy: collaborator.invitedBy,
        joinedAt: collaborator.joinedAt,
        user: collaborator.user,
        onlineStatus: presence.has(collaborator.userId) ? "online" : "offline",
        isCreator: collaborator.userId === document.creatorId,
      }));

      const hasCreatorInList = users.some((item) => item.isCreator);
      if (!hasCreatorInList) {
        users.unshift({
          id: null,
          documentId,
          userId: document.creator.id,
          role: "OWNER",
          invitedBy: null,
          joinedAt: null,
          user: document.creator,
          onlineStatus: presence.has(document.creatorId) ? "online" : "offline",
          isCreator: true,
        });
      }

      

      callback?.({
        success: true,
        data: users,
      });
    } catch (error) {
      callback?.({
        success: false,
        message: "Failed to fetch collaborator status",
      });
    }
  });
};

export default collaboratorOnlineStatusHandler;
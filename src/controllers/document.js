import AppError from "../middlewares/appError.js";
import prisma from "../config/prisma.js";
import { createShareLink } from "../utils/document/createShareLink .js";

import * as Y from "yjs";

const ydoc = new Y.Doc();
const state = Y.encodeStateAsUpdate(ydoc);

export const create = async (req, res, next) => {
  try {
    const { topic, content } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return next(new AppError("Document name is required", 400));
    }

    // if (typeof content !== "string") {
    //   return next(new AppError("Document content must be a string", 400));
    // }

    const document = await prisma.document.create({
      data: {
        name: topic.trim(),
        creatorId: req.user.id,
        versions: {
          create: {
            version: 1,
            createdBy: {
              connect: {
                id: req.user.id,
              },
            },
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

        const share = await createShareLink(
        document.id,
        req.user.id
    );
    console.log(share)
    console.log(document)

    const ownerToken = share.ownerShareLink.token
    console.log(ownerToken)

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: {document, ownerToken},
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { creatorId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            userId: true,
            role: true,
            joinedAt: true,
          },
        },
        shareLinks: {
          where: {
            isActive: true,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
          select: {
            role: true,
            token: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const data = documents.map(({ shareLinks, ...document }) => {
      const associatedRole =
        document.creatorId === req.user.id
          ? "OWNER"
          : document.collaborators.find(
              (collaborator) => collaborator.userId === req.user.id,
            )?.role;

      const associatedRoleToken =
        shareLinks.find((shareLink) => shareLink.role === associatedRole)
          ?.token ?? null;

      return {
        ...document,
        associatedRoleToken,
      };
    });

    res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return next(new AppError("Document id is required", 400));
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { creatorId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        collaborators: {
          select: {
            id: true,
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
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: document,
    });
  } catch (error) {
    return next(error);
  }
};

export const getByDocumentToken = async (req, res, next) => {
  try {
    const { documentToken } = req.params;

    if (!documentToken) {
      return next(new AppError("Document token is required", 400));
    }

    const shareLinkRecord = await prisma.documentShareLink.findUnique({
      where: {
        token: documentToken,
      },
      select: {
        id: true,
        token: true,
        documentId: true,
        role: true,
        createdById: true,
        expiresAt: true,
        isActive: true,
        createdAt: true,
        document: {
          include: {
            creator: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
            collaborators: {
              select: {
                id: true,
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
              orderBy: {
                joinedAt: "asc",
              },
            },
            shareLinks: {
              select: {
                id: true,
                token: true,
                documentId: true,
                role: true,
                createdById: true,
                expiresAt: true,
                isActive: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    if (!shareLinkRecord) {
      return next(new AppError("Document share link not found", 404));
    }

    const {
      document: { shareLinks: documentShareLinks, ...document },
      ...currentDocumentShareLink
    } = shareLinkRecord;

    const data = {
      document,
      documentShareLinks,
      currentDocumentShareLink,
    };

    res.status(200).json({
      success: true,
      message: "Document and share links fetched successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const assignCollaborator = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const {  role = "EDITOR" } = req.body;
    const userId= req.user.id


 

    if (!documentId) {
      return next(new AppError("Document id is required", 400));
    }

    if (!userId || typeof userId !== "string") {
      return next(new AppError("Collaborator user id is required", 400));
    }

    const normalizedRole =
      typeof role === "string" ? role.trim().toUpperCase() : "";

    if (![
      "EDITOR",
      "VIEWER",
    ].includes(normalizedRole)) {
      return next(
        new AppError("Collaborator role must be EDITOR or VIEWER", 400),
      );
    }

    // if (userId === req.user.id) {
    //   return next(
    //     new AppError("Document owner cannot be added as a collaborator", 400),
    //   );
    // }

    const [document, collaboratorUser] = await Promise.all([
      prisma.document.findUnique({
        where: {
          id: documentId,
        },
        select: {
          creatorId: true,
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!document) {
      return next(new AppError("Document not found", 404));
    }


    if (!collaboratorUser) {
      return next(new AppError("Collaborator user not found", 404));
    }

    const collaborator = await prisma.documentCollaborator.upsert({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
      create: {
        documentId,
        userId,
        role: normalizedRole,
        invitedBy: req.user.id,
      },
      update: {
        role: normalizedRole,
        invitedBy: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Collaborator assigned successfully",
      data: collaborator,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCollaborators = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return next(new AppError("Document id is required", 400));
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { creatorId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    const collaborators = await prisma.documentCollaborator.findMany({
      where: {
        documentId,
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
      orderBy: {
        joinedAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Collaborators fetched successfully",
      data: collaborators,
    });
  } catch (error) {
    return next(error);
  }
};
export const acceptShareLink = async (req, res) => {
try {
  
  const { token } = req.params;

  const userId = req.user.id;

  const share = await prisma.documentShareLink.findUnique({
      where: {
          token
      },
      include: {
          document: true
      }
  });

  if (!share)
      throw new Error("Invalid Link");

  if (!share.isActive)
      throw new Error("Link expired");

  if (
      share.expiresAt &&
      share.expiresAt < new Date()
  ) {
      throw new Error("Share link expired");
  }

  const alreadyJoined =
      await prisma.documentCollaborator.findFirst({
          where: {
              documentId: share.documentId,
              userId
          }
      });

  if (!alreadyJoined) {

      await prisma.documentCollaborator.create({
          data: {
              documentId: share.documentId,
              userId,
              role: share.role
          }
      });

  }

  return res.json({
      success: true,
      documentId: share.documentId
  });
} catch (error) {
  return next(error);
}
};

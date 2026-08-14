import prisma from "../config/prisma.js";
import AppError from "../middlewares/appError.js";

export const cleanupDatabase = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return next(
        new AppError("Database cleanup is disabled in production", 403),
      );
    }

    await prisma.$transaction([
      prisma.documentShareLink.deleteMany(),
      prisma.documentCollaborator.deleteMany(),
      prisma.documentVersion.deleteMany(),
      prisma.document.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    res.status(200).json({
      success: true,
      message: "All database tables were cleaned successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export default cleanupDatabase;

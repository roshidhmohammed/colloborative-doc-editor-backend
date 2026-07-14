import jwt from "jsonwebtoken";
import AppError from "./appError.js";
import prisma from "../config/prisma.js";

const isUserAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies)
  try {
    if (!token) {
      return next(new AppError("Please login again", 401));
    }
    const decodedObj = await jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (!decodedObj) {
      return next(new AppError("Please login again", 401));
    }
    const { id } = decodedObj;
    if (!id) {
      return next(new AppError("Please login again", 401));
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export default isUserAuthenticated;

import AppError from "../middlewares/appError.js";
import bcrypt from "bcrypt";
import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    console.log(email)

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError("Email already registered", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered",
      data: createdUser,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email)
    console.log(password)

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Password is incorrect", 401));
    }

    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "testing"

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: isProduction, // true only in production HTTPS
  sameSite: isProduction ? "none" : "lax",
  path:"/"
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
};

export const checkUserAuthentication = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "successfully verified user auth",
      data: req.user,
    });
  } catch (error) {
    return next(error);
  }
};


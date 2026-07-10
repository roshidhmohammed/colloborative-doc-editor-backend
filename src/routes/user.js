import express from "express";
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js";
import isUserAuthenticated from "../middlewares/userAuth.js";
import { profile } from "../controllers/user.js";
const userRouter = express.Router();

userRouter.get("/profile", isUserAuthenticated, catchAsyncErrors(profile));

export default userRouter;

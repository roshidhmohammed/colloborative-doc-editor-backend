import express from "express";
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js";
import isUserAuthenticated from "../middlewares/userAuth.js";
import { checkUserAuthentication, login, logout, register } from "../controllers/userAuth.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/", catchAsyncErrors(register));
userAuthRouter.post("/login", catchAsyncErrors(login));
userAuthRouter.post("/logout", catchAsyncErrors(logout));
userAuthRouter.get("/check-user-auth", isUserAuthenticated, catchAsyncErrors(checkUserAuthentication));

export default userAuthRouter;
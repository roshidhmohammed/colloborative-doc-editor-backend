import express from "express";
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js";
import { cleanupDatabase } from "../controllers/db.js";

const dbRouter = express.Router();

dbRouter.delete("/cleanup", catchAsyncErrors(cleanupDatabase));

export default dbRouter;

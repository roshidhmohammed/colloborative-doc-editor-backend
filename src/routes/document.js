import express from "express";
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js";
import isUserAuthenticated from "../middlewares/userAuth.js";
import {
  assignCollaborator,
  create,
  getAll,
  getById,
  getByDocumentToken,
  getCollaborators,
} from "../controllers/document.js";

const documentRouter = express.Router();

documentRouter.get("/", isUserAuthenticated, catchAsyncErrors(getAll));
documentRouter.get(
  "/:documentId/collaborators",
  isUserAuthenticated,
  catchAsyncErrors(getCollaborators),
);
documentRouter.post(
  "/:documentId/collaborators",
  isUserAuthenticated,
  catchAsyncErrors(assignCollaborator),
);
documentRouter.get(
  "/:documentToken",
  isUserAuthenticated,
  catchAsyncErrors(getByDocumentToken),
);
documentRouter.get(
  "/:documentId",
  isUserAuthenticated,
  catchAsyncErrors(getById),
);

documentRouter.post("/", isUserAuthenticated, catchAsyncErrors(create));

export default documentRouter;

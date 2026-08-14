import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import dbRouter from "./routes/db.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://colloborative-document-editor-front.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));

app.get("/env", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
  });
});


app.use("/api/db", dbRouter);

app.use(errorHandler);

export default app;

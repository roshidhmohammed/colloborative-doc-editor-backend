import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.js";
import userAuthRouter from "./routes/userAuth.js";
import userRouter from "./routes/user.js";
import documentRouter from "./routes/document.js";

const app = express()

app.use(cors({
    origin:["http://localhost:3000", "https://colloborative-doc-editor-frontend-7dvjurait.vercel.app"],
    credentials:true
}))
app.use(cookieParser())

app.use(express.json({limit:"10mb"}))

app.get("/env", (req, res) => {
    res.json({
        env: process.env.NODE_ENV,
        // db: process.env.DATABASE_URL,
        port: process.env.PORT,
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message:"Server is healthy",
    });
});


app.use("/api/auth", userAuthRouter)
app.use("/api/user", userRouter)
app.use("/api/document", documentRouter)

app.use(errorHandler)

export default app;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js";
import commentRouter from "./routes/comment.routes.js";




const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter)
app.use("/api/v1/projects", projectRouter);
app.use(
    "/api/v1/comments",
    commentRouter
);



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CodeHub API is running",
    });
});

// Error middleware should always be at the end
app.use(errorHandler);

export { app };
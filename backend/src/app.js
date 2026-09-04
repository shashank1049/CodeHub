import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js";
import commentRouter from "./routes/comment.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import followRouter from "./routes/follow.routes.js";
import searchRouter from "./routes/search.routes.js";
import adminRouter from "./routes/admin.routes.js";





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
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/admin", adminRouter);



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CodeHub API is running",
    });
});

// Error middleware should always be at the end
app.use(errorHandler);

export { app };
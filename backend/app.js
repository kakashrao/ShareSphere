import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(cookieParser());

// Routes Imports
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/user", userRoutes);
app.use("/post", postRoutes);

export default app;

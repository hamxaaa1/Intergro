import express from "express"
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import reportRoutes from "./routes/report.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRoutes from "./routes/chat.route.js";
import mergeRoutes from "./routes/merge.route.js"

import { app, server } from "./lib/socket.js"; // <-- reuse app & server from socket.js

app.set("trust proxy", 1);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", mergeRoutes);

// ✅ Test route
app.get("/hello", (req, res) => {
  res.send("hello there, how are you!");
});

// ✅ Start server (use server, not app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO listening on port ${PORT}`);
  connectDB();
});

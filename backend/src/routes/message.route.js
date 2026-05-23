import express from "express";
import { protect } from '../middlewares/auth.middleware.js';
import { deleteMessage, deleteMultipleMessages, getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/users", protect, getUsersForSidebar);
router.get("/:id", protect, getMessages);

// 👇 here we add multer like register route
router.post("/send/:id", protect, upload.single("image"), sendMessage);
router.delete("/:messageId", protect, deleteMessage);
router.post("/deleteMany", protect, deleteMultipleMessages);

export default router;

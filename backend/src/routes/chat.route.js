import express from "express";
import { sendMessage, getUserChat } from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/me", protect, getUserChat);


export default router;

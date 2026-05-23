import express from "express";
import { uploadMiddleware, mergeFiles } from "../controllers/merge.controller.js";

const router = express.Router();

router.post("/merge", uploadMiddleware, mergeFiles);

export default router;

import express from 'express';
import { getUserProfile, loginUser, logout, registerUser, updateUserProfile } from '../controllers/auth.controller.js';
import {protect} from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
const router = express.Router();

router.post('/register', upload.single("avatar"), registerUser)
router.post('/login', loginUser) 
router.get('/logout', logout) 
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect,  upload.single("avatar"), updateUserProfile)


export default router;
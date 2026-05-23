import express from 'express';
import {protect, adminOnly} from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/', protect, adminOnly, getUsers)
router.get('/:id', protect, getUserById)
router.delete('/:id', protect, adminOnly, deleteUser)



export default router;
import express from 'express';
import userHandlers from '../handlers/userHandler.js';
import upload from '../config/multer.js';
import authUser from '../middleware/authMiddleware.js';

const router = express.Router();
const { registerUser, loginUser, fetchUsers } = userHandlers;

router.post('/register',upload.single('file'), registerUser);
router.get('/login', loginUser);
router.get('/fetchUsers', authUser, fetchUsers);

export default router;
// authRoutes.js (ESM style)
import express from 'express';
import { registerUser, loginUser} from '../controllers/authController.js';
import { getUserProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',authenticate, getUserProfile);
// Middleware to check if user is authenticated

export default router;













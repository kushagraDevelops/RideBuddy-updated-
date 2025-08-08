import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {getChatHistory} from '../controllers/chatController.js';
const router = express.Router();

router.get('/:bookingId/messages', authenticate,getChatHistory);
export default router;

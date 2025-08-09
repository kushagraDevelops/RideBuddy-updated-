import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();



// Fetch all messages for a given ride
// Example: GET /api/chats/15/messages
router.get('/:rideId/messages', authenticate, getMessages);

// Send a new message in this ride's chat
// Example: POST /api/chats/15/messages
// Body: { content: "Hello driver!" }
router.post('/:rideId/messages', authenticate, sendMessage);

export default router;

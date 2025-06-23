import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', authenticate, createBooking);

export default router;
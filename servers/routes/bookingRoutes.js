import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { getDriverRides, getPassengerRides } from '../controllers/bookingController.js';

const router = express.Router();
router.post('/', authenticate, createBooking);
router.get('/driver',authenticate,getDriverRides);
router.get('/passenger', authenticate, getPassengerRides);

export default router;
import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { getDriverRides, getPassengerRides } from '../controllers/bookingController.js';
import { getRideBookings } from '../controllers/bookingController.js';
import { confirmBooking,rejectBooking } from '../controllers/bookingController.js';


const router = express.Router();
router.post('/', authenticate, createBooking);
router.get('/driver',authenticate,getDriverRides);
router.get('/passenger', authenticate, getPassengerRides);
router.get('/driver/:rideId', authenticate, getRideBookings);
router.put('/:bookingId/confirm', authenticate, confirmBooking);
router.put('/:bookingId/reject', authenticate, rejectBooking);


export default router;
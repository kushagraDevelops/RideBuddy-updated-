import express from 'express';
import {createRide} from '../controllers/ridecontroller.js';
import {searchRides} from '../controllers/ridecontroller.js';
import {getRideById} from '../controllers/ridecontroller.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/postride', authenticate, createRide);
router.get('/search', searchRides);
router.get('/:rideId', getRideById);
 

export default router;
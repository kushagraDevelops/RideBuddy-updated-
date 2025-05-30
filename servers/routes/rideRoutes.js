import express from 'express';
import {createRide} from '../controllers/ridecontroller.js';
import {searchRides} from '../controllers/ridecontroller.js';

const router = express.Router();
router.post('/postride', createRide);
router.get('/search', searchRides);
 

export default router;
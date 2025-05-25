import express from 'express';
import {createRide} from '../controllers/ridecontroller.js';

const router = express.Router();
router.post('/postride', createRide);

export default router;
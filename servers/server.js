import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


// Use auth routes
app.use('/api/auth', authRoutes);

// Use ride routes
app.use('/api/rides', rideRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


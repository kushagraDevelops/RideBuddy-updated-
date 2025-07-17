// controllers/authController.js

import bcrypt from 'bcrypt';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET
export const registerUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number } = req.body;
    // Check if user already exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, phone_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [email, hashedPassword, first_name, last_name, phone_number]
    );
    // console.log(newUser.rows[0].user_id);

    // Generate JWT token
    const token = jwt.sign(
  { userId: newUser.rows[0].user_id, email: newUser.rows[0].email }, // CHANGE .id → .user_id
  JWT_SECRET,
  { expiresIn: '1h' }
);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
      token, // <-- send token here
    });

  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
   const token = jwt.sign(
  { userId: user.user_id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// console.log(user.user_id, user.email, token)

    res.status(200).json({
      message: 'Login successful',
      user,
      token, // <-- send token here
    });
  } catch (error) {
    console.error('❌ Error logging in:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // Debug: Check what's available in req.user
    console.log('req.user:', req.user);
    
    // Handle different possible property names
    const userId = req.user?.userId || req.user?.user_id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Get user data with all needed fields
    const userResult = await db.query(`
      SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        profile_picture,
        is_driver,
        driver_license,
        vehicle_info,
        average_rating,
        created_at
      FROM users 
      WHERE user_id = $1
    `, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get recent rides (last 5 rides) with correct column names
    let ridesResult = { rows: [] };
    
    try {
      // Updated query with correct column names from bookings table
      ridesResult = await db.query(`
        SELECT 
          b.booking_id,
          r.origin as pickup,
          r.destination as dropoff,
          r.departure_time,
          CASE 
            WHEN r.driver_id = $1 THEN 'Driver'
            ELSE 'Passenger'
          END as role
        FROM bookings b
        JOIN rides r ON b.ride_id = r.ride_id
        WHERE (r.driver_id = $1 OR b.passenger_id = $1)
        ORDER BY r.departure_time DESC
        LIMIT 5
      `, [userId]);
    } catch (error) {
      console.log('Error fetching rides:', error.message);
      ridesResult = { rows: [] };
    }
    
    const user = userResult.rows[0];
    
    // Transform to frontend-expected format
    const userProfile = {
      name: `${user.first_name} ${user.last_name}`.trim(),
      username: user.email.split('@')[0], // Generate username from email
      email: user.email || '',
      phone: user.phone_number || '',
      profileImage: user.profile_picture || 'https://via.placeholder.com/150',
      verified: user.driver_license ? true : false, // Consider verified if has driver license
      rating: parseFloat(user.average_rating) || 0,
      type: user.is_driver ? 'Driver' : 'Passenger',
      recentRides: ridesResult.rows.map(ride => ({
        id: ride.booking_id,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        date: new Date(ride.departure_time).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: new Date(ride.departure_time).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        role: ride.role
      })) || []
    };
    
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
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
    console.log(newUser.rows[0].user_id);

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

console.log(user.user_id, user.email, token)

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


import db from '../config/db.js';

export const createBooking = async (req, res) => {
    console.log('🔍 req.user:', req.user);
  console.log('🔍 passengerId:', req.user?.userId);

  const { rideId, seats, totalAmount, paymentMethod } = req.body;
  const passengerId = req.user.userId; // Securely extracted from JWT
  console.log(passengerId)
  try {
    // 1. Check seat availability
    const rideResult = await db.query(
      `SELECT available_seats, price_per_seat FROM rides WHERE ride_id = $1`,
      [rideId]
    );
    if (!rideResult.rows.length) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    if (rideResult.rows[0].available_seats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // 2. Calculate total amount if not sent from frontend
    const calculatedAmount = rideResult.rows[0].price_per_seat * seats;

    // 3. Create booking
    const bookingResult = await db.query(
      `INSERT INTO bookings
        (ride_id, passenger_id, seats_booked, booking_status, total_amount, payment_status, payment_method)
       VALUES ($1, $2, $3, 'pending', $4, 'unpaid', $5)
       RETURNING *`,
      [rideId, passengerId, seats, totalAmount || calculatedAmount, paymentMethod || null]
    );

    // 4. Update available seats
    await db.query(
      `UPDATE rides SET available_seats = available_seats - $1 WHERE ride_id = $2`,
      [seats, rideId]
    );

    res.status(201).json({
      message: 'Booking created',
      booking: bookingResult.rows[0]
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDriverRides = async (req, res) => {
  const driverId = req.user.userId;
  
  try {
    const result = await db.query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM bookings WHERE ride_id = r.ride_id) AS passengers,
        (SELECT SUM(seats_booked) FROM bookings WHERE ride_id = r.ride_id) AS seats_booked
       FROM rides r
       WHERE r.driver_id = $1
       ORDER BY r.departure_time DESC`,
      [driverId]
    );
    
    res.json({ rides: result.rows });
  } catch (error) {
    console.error('Error fetching driver rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPassengerRides = async (req, res) => {
  const passengerId = req.user.userId;
  
  try {
    const result = await db.query(
      `SELECT 
        b.booking_id, b.seats_booked, b.booking_status, b.payment_status,
        r.*, 
        u.first_name, u.last_name, u.profile_pic
       FROM bookings b
       JOIN rides r ON b.ride_id = r.ride_id
       JOIN users u ON r.driver_id = u.user_id
       WHERE b.passenger_id = $1
       ORDER BY r.departure_time DESC`,
      [passengerId]
    );
    
    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching passenger rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getRideBookings = async (req, res) => {
  const { rideId } = req.params;
  const driverId = req.user.userId;

  try {
    // Check if the logged-in user is the driver of this ride AND fetch ride details
    const rideQuery = await db.query(
      `SELECT * FROM rides WHERE ride_id = $1 AND driver_id = $2`,
      [rideId, driverId]
    );
    
    if (!rideQuery.rows.length) {
      return res.status(403).json({ message: 'Unauthorized or ride not found' });
    }

    const ride = rideQuery.rows[0];

    // Fetch all bookings for this ride
    const bookingsQuery = await db.query(
      `SELECT b.booking_id, b.seats_booked, b.booking_status, b.total_amount, b.created_at, b.passenger_id,
              u.first_name, u.last_name, u.email, u.phone_number, u.profile_pic, u.average_rating
       FROM bookings b
       JOIN users u ON b.passenger_id = u.user_id
       WHERE b.ride_id = $1
       ORDER BY b.created_at ASC`,
      [rideId]
    );

    // Return both ride details and bookings
    res.json({ 
      ride: ride,
      bookings: bookingsQuery.rows 
    });
  } catch (error) {
    console.error('Error fetching ride bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const confirmBooking = async (req, res) => {
  const { bookingId } = req.params;
  const driverId = req.user.userId;

  try {
    // First, verify that the logged-in user is the driver for this booking
    const verifyQuery = await db.query(
      `SELECT r.driver_id 
       FROM bookings b 
       JOIN rides r ON b.ride_id = r.ride_id 
       WHERE b.booking_id = $1`,
      [bookingId]
    );

    if (!verifyQuery.rows.length || verifyQuery.rows[0].driver_id !== driverId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update booking status to confirmed
    await db.query(
      'UPDATE bookings SET booking_status = $1 WHERE booking_id = $2',
      ['confirmed', bookingId]
    );

    res.json({ message: 'Booking confirmed successfully' });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectBooking = async (req, res) => {
  const { bookingId } = req.params;
  const driverId = req.user.userId;

  try {
    // First, verify that the logged-in user is the driver for this booking
    const verifyQuery = await db.query(
      `SELECT r.driver_id 
       FROM bookings b 
       JOIN rides r ON b.ride_id = r.ride_id 
       WHERE b.booking_id = $1`,
      [bookingId]
    );

    if (!verifyQuery.rows.length || verifyQuery.rows[0].driver_id !== driverId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update booking status to rejected
    await db.query(
      'UPDATE bookings SET booking_status = $1 WHERE booking_id = $2',
      ['rejected', bookingId]
    );

    res.json({ message: 'Booking rejected successfully' });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
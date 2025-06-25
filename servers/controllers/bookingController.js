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




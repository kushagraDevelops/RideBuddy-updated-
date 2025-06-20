import db from '../config/db.js';

export const createRide = async (req, res) => {
  try {
    const {
      startLocation,
      destination,
      departureDate,
      departureTime,
      expectedReachingTime,
      seats,
      price,
      notes
    } = req.body;

    // Input validation
    if (!startLocation || !destination || !departureDate || !departureTime || !seats || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const departure_time = `${departureDate} ${departureTime}`;
    const estimated_arrival_time = expectedReachingTime ? `${departureDate} ${expectedReachingTime}` : null;
    const driver_id = req.user?.userId || 4;

    // Log the data for debugging
    console.log('Inserting ride:', {
      driver_id,
      startLocation,
      destination,
      departure_time,
      estimated_arrival_time,
      seats,
      price,
      notes
    });

    const result = await db.query(
      `INSERT INTO rides
      (driver_id, origin, destination, departure_time, estimated_arrival_time, available_seats, price_per_seat, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        driver_id,
        startLocation,
        destination,
        departure_time,
        estimated_arrival_time,
        seats === "6+" ? 6 : parseInt(seats, 10),
        price ? parseFloat(price) : 0,
        notes || null
      ]
    );

    res.status(201).json({
      message: 'Ride created successfully',
      ride: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error creating ride:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



export const searchRides = async (req, res) => {
  const { from, to, date } = req.query;
  try {
    const result = await db.query(
      `SELECT r.*, u.first_name AS driver_name
       FROM rides r
       JOIN users u ON r.driver_id = u.user_id
       WHERE r.origin ILIKE $1 AND r.destination ILIKE $2 AND DATE(r.departure_time) = $3`,
      [`%${from}%`, `%${to}%`, date]
    );

    const stats = {
      total: result.rowCount,
      average_price: result.rowCount
        ? result.rows.reduce((acc, ride) => acc + parseFloat(ride.price_per_seat), 0) / result.rowCount
        : 0
    };

    res.json({
      rides: result.rows,
      stats,
      message: `Found ${result.rowCount} rides matching your criteria.`
    });
  } catch (error) {
    console.error('❌ Error searching rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getRideById = async (req, res) => {
  const { rideId } = req.params;
  try {
    const result = await db.query(
      `SELECT r.*, u.first_name AS driver_name
       FROM rides r
       JOIN users u ON r.driver_id = u.user_id
       WHERE r.ride_id = $1`,
      [rideId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.json({ ride: result.rows[0] });
  } catch (error) {
    console.error('❌ Error fetching ride:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createBooking = async (req, res) => {
  const { rideId, seats } = req.body;
  const passengerId = req.user.userId; // Securely extracted from JWT

  try {
    // 1. Check seat availability
    const rideResult = await db.query(
      `SELECT available_seats FROM rides WHERE ride_id = $1`,
      [rideId]
    );
    if (!rideResult.rows.length) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    if (rideResult.rows[0].available_seats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // 2. Create booking
    const bookingResult = await db.query(
      `INSERT INTO bookings (ride_id, passenger_id, seats, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [rideId, passengerId, seats]
    );

    // 3. Update available seats
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
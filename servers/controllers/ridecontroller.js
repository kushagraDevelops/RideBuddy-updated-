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


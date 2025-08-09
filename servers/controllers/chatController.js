import db from '../config/db.js';

// Helper: Check if the logged-in user is allowed to chat in this ride
export const isUserParticipantInConfirmedRide = async (userId, rideId) => {
  // Check if user is driver
  const driverRes = await db.query(
    `SELECT driver_id FROM rides WHERE ride_id = $1`, [rideId]
  );
  if (driverRes.rows.length && driverRes.rows[0].driver_id === userId) {
    return { allowed: true, role: 'driver', otherUserId: null, bookingId: null };
  }

  // Check for a confirmed booking, get booking_id and driver_id too
  const bookingRes = await db.query(
    `SELECT b.booking_id, b.booking_status, r.driver_id
     FROM bookings b
     JOIN rides r ON b.ride_id = r.ride_id
     WHERE b.ride_id = $1 AND b.passenger_id = $2`, [rideId, userId]
  );
  if (bookingRes.rows.length && bookingRes.rows[0].booking_status === 'confirmed') {
    return { 
      allowed: true, 
      role: 'passenger', 
      otherUserId: bookingRes.rows[0].driver_id, 
      bookingId: bookingRes.rows[0].booking_id 
    };
  }

  return { allowed: false };
};

// ✅ Fetch all chat messages for a ride (between driver and confirmed passenger)
export const getMessages = async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.userId;

  // Only confirmed participants (driver or passenger with confirmed booking)
  

  try {
    // Fetch all messages for this ride
    const result = await db.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.sent_at,
              u1.first_name AS sender_first_name, u1.last_name AS sender_last_name,
              u2.first_name AS receiver_first_name, u2.last_name AS receiver_last_name
         FROM messages m
    LEFT JOIN users u1 ON m.sender_id = u1.user_id
    LEFT JOIN users u2 ON m.receiver_id = u2.user_id
        WHERE m.ride_id = $1
     ORDER BY m.sent_at ASC`,
      [rideId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Post a new message
export const sendMessage = async (req, res) => {
  const { rideId } = req.params;
  const senderId = req.user.userId;
  const { content } = req.body;

  // Confirm role and get receiver
  const check = await isUserParticipantInConfirmedRide(senderId, rideId);
  if (!check.allowed) {
    return res.status(403).json({ message: 'You are not a participant in this ride\'s chat' });
  }

  let receiverId;
  if (check.role === 'driver') {
    // Get confirmed passenger
    const passengerQuery = await db.query(
      `SELECT passenger_id FROM bookings WHERE ride_id = $1 AND booking_status = 'confirmed' LIMIT 1`,
      [rideId]
    );
    if (!passengerQuery.rows.length) {
      return res.status(400).json({ message: 'No confirmed passenger for this ride' });
    }
    receiverId = passengerQuery.rows[0].passenger_id;
  } else {
    // If sender is passenger, receiver is driver
    receiverId = check.otherUserId;
  }

  if (!content || !receiverId) {
    return res.status(400).json({ message: 'Message content and valid receiver required' });
  }

  try {
    const insertRes = await db.query(
      `INSERT INTO messages (ride_id, sender_id, receiver_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_id, receiver_id, content, sent_at`,
      [rideId, senderId, receiverId, content]
    );
    res.status(201).json({ message: insertRes.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

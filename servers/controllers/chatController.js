import db from '../config/db.js';


export const getChatHistory = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id; // Assuming your auth middleware adds user to req

    try {
        // Security Check: Verify the user is part of this booking
        const [bookingCheck] = await db.query(
            `SELECT r.driver_id, b.passenger_id 
             FROM bookings b
             JOIN rides r ON b.ride_id = r.ride_id
             WHERE b.booking_id = ?`,
            [bookingId]
        );

        if (!bookingCheck || (userId !== bookingCheck.driver_id && userId !== bookingCheck.passenger_id)) {
            return res.status(403).json({ message: "Forbidden: You are not part of this chat." });
        }

        // Fetch messages for the booking
        const [messages] = await db.query(
            `SELECT m.sender_id, m.message_text, m.timestamp, u.first_name 
             FROM messages m
             JOIN users u ON m.sender_id = u.user_id
             WHERE m.booking_id = ? 
             ORDER BY m.timestamp ASC`,
            [bookingId]
        );

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Server error while fetching messages." });
    }
};
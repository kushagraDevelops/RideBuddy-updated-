import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,  // make sure this matches the .env key
  port: process.env.DB_PORT,
});

export default pool;




// now i have created folder structure and created a database in postgres 
// 1. Users Table
// sqlCREATE TABLE users (
//     user_id SERIAL PRIMARY KEY,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     first_name VARCHAR(100) NOT NULL,
//     last_name VARCHAR(100) NOT NULL,
//     phone_number VARCHAR(20),
//     profile_picture VARCHAR(255),
//     is_driver BOOLEAN DEFAULT FALSE,
//     driver_license VARCHAR(50),
//     vehicle_info JSONB,
//     average_rating DECIMAL(3,2) DEFAULT 0,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 2. Rides Table
// sqlCREATE TABLE rides (
//     ride_id SERIAL PRIMARY KEY,
//     driver_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     origin VARCHAR(255) NOT NULL,
//     destination VARCHAR(255) NOT NULL,
//     origin_coordinates POINT,
//     destination_coordinates POINT,
//     departure_time TIMESTAMP NOT NULL,
//     estimated_arrival_time TIMESTAMP,
//     available_seats INTEGER NOT NULL,
//     price_per_seat DECIMAL(10,2) NOT NULL,
//     description TEXT,
//     status VARCHAR(20) DEFAULT 'active',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 3. Bookings Table
// sqlCREATE TABLE bookings (
//     booking_id SERIAL PRIMARY KEY,
//     ride_id INTEGER REFERENCES rides(ride_id) ON DELETE CASCADE,
//     passenger_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     seats_booked INTEGER NOT NULL DEFAULT 1,
//     booking_status VARCHAR(20) DEFAULT 'pending',
//     total_amount DECIMAL(10,2) NOT NULL,
//     payment_status VARCHAR(20) DEFAULT 'unpaid',
//     payment_method VARCHAR(50),
//     payment_id VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 4. Reviews Table
// sqlCREATE TABLE reviews (
//     review_id SERIAL PRIMARY KEY,
//     booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
//     reviewer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     reviewee_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
//     comment TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 5. Messages Table (for in-app communication)
// sqlCREATE TABLE messages (
//     message_id SERIAL PRIMARY KEY,
//     sender_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     receiver_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     ride_id INTEGER REFERENCES rides(ride_id) ON DELETE CASCADE,
//     message_text TEXT NOT NULL,
//     is_read BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 6. User Preferences Table (Optional)
// sqlCREATE TABLE user_preferences (
//     preference_id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     smoking_allowed BOOLEAN DEFAULT FALSE,
//     pets_allowed BOOLEAN DEFAULT FALSE,
//     music_preferences VARCHAR(100),
//     max_luggage_size VARCHAR(50),
//     other_preferences JSONB,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 7. Locations Table (Optional - for frequently used locations)
// sqlCREATE TABLE saved_locations (
//     location_id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     location_name VARCHAR(100) NOT NULL,
//     address VARCHAR(255) NOT NULL,
//     coordinates POINT,
//     is_home BOOLEAN DEFAULT FALSE,
//     is_work BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// 8. Notifications Table
// sqlCREATE TABLE notifications (
//     notification_id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
//     notification_type VARCHAR(50) NOT NULL,
//     content TEXT NOT NULL,
//     related_id INTEGER,
//     is_read BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// Step 3: Create Indexes for Better Performance
// sql-- Indexes for faster querying
// CREATE INDEX idx_rides_departure_time ON rides(departure_time);
// CREATE INDEX idx_rides_origin_destination ON rides(origin, destination);
// CREATE INDEX idx_bookings_ride_id ON bookings(ride_id);
// CREATE INDEX idx_bookings_passenger_id ON bookings(passenger_id);
// CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
// CREATE INDEX idx_notifications_user_id ON notifications(user_id);
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, MessageCircle, Mail } from 'lucide-react';
import ContactModal from './contact';
import { useNavigate } from 'react-router-dom';

function MyRides() {
  const [activeTab, setActiveTab] = useState('joined');
  const [joinedRides, setJoinedRides] = useState([]);
  const [offeringRides, setOfferingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // Changed from selectedDriver
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        setLoading(true);
        
        if (activeTab === 'joined') {
          const response = await fetch('http://localhost:5000/api/bookings/passenger', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          setJoinedRides(data.bookings || []);
        } else {
          const response = await fetch('http://localhost:5000/api/bookings/driver', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          setOfferingRides(data.rides || []);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRides();
  }, [activeTab]);

  const handleChatClick = (ride) => {
    // Navigate to chat with the driver
    // You can implement this based on your routing setup
    // For example: navigate(`/chat/${ride.driver_id}`) or window.location.href = `/chat/${ride.driver_id}`
    navigate(`/chat/${ride.ride_id}`);
    console.log('Opening chat with driver:', ride.first_name, ride.last_name);
    console.log(ride);
    // Replace with your actual chat navigation logic
  };

  const handleContactClick = (ride) => {
    // Pass bookingId instead of driver object
    console.log('Opening contact modal for booking:', ride.booking_id);
    setSelectedBookingId(ride.booking_id);
    setShowContactModal(true);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderRideCard = (ride, isOffering = false) => (
    <div key={ride.ride_id} className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-4">
      {!isOffering ? (
        <>
          <div className="flex items-center mb-4">
            <img
              src={ride.profile_pic || '/default-profile.png'}
              alt={`${ride.first_name} ${ride.last_name}`}
              className="h-10 w-10 rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="text-md font-medium text-gray-900">
                {ride.first_name} {ride.last_name}
              </h3>
              {renderStars(4.5)}
            </div>
            <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
              ride.booking_status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : ride.booking_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {ride.booking_status}
            </span>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2">
              <p className="text-xs text-gray-500">FROM</p>
              <p className="text-sm font-medium">{ride.origin}</p>
            </div>
            <div className="w-1/2">
              <p className="text-xs text-gray-500">TO</p>
              <p className="text-sm font-medium">{ride.destination}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-xs">{new Date(ride.departure_time).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-xs">{new Date(ride.departure_time).toLocaleTimeString()}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-indigo-600">
              ₹{(ride.price_per_seat * ride.seats_booked).toFixed(2)}
            </p>
          </div>
          
          {/* Chat and Contact buttons - only show for confirmed rides */}
          {ride.booking_status === 'confirmed' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleChatClick(ride)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => handleContactClick(ride)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md text-sm transition duration-300 flex items-center justify-center"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex mb-2">
            <div className="w-1/2">
              <p className="text-xs text-gray-500">FROM</p>
              <p className="text-sm font-medium">{ride.origin}</p>
            </div>
            <div className="w-1/2">
              <p className="text-xs text-gray-500">TO</p>
              <p className="text-sm font-medium">{ride.destination}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-xs">{new Date(ride.departure_time).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-xs">{new Date(ride.departure_time).toLocaleTimeString()}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-indigo-600">₹{ride.price_per_seat}/seat</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm text-gray-700">
                {ride.passengers || 0} passengers ({ride.seats_booked || 0} seats)
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-2 bg-indigo-600 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      100, 
                      ((ride.seats_booked || 0) / ride.available_seats) * 100
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
            <a href={`/MyRides/manage/${ride.ride_id}`}>
              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-1 px-3 rounded-md text-sm transition duration-300">
                Manage
              </button>
            </a>
          </div>
        </>
      )}
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading rides...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 rounded-lg shadow-inner mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Rides</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('joined')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'joined'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rides I've Joined
          </button>
          <button
            onClick={() => setActiveTab('offering')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'offering'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rides I'm Offering
          </button>
        </nav>
      </div>

      {/* Rides Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'joined' && joinedRides.map(ride => 
          renderRideCard({ ...ride, driver: { 
            name: `${ride.first_name} ${ride.last_name}`,
            profilePic: ride.profile_pic,
            rating: 4.5
          }}, false)
        )}

        {activeTab === 'offering' && offeringRides.map(ride => 
          renderRideCard({ 
            ...ride, 
            passengers: ride.passengers, 
            seats: ride.available_seats 
          }, true)
        )}
      </div>

      {/* Contact Modal - Updated to use bookingId */}
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        bookingId={selectedBookingId}  // ✅ Now passing bookingId
      />
    </div>
  );
}

export default MyRides;
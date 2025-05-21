import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';

function RideOffer() {
  // Initialize all state with default values
  const [activeTab, setActiveTab] = useState('joined');
  const [myRides, setMyRides] = useState({
    joined: [],
    offering: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sample data safely
  useEffect(() => {
    try {
      setMyRides({
        joined: [
          {
            id: 1,
            driver: {
              name: 'John Doe',
              profilePic: '/default-profile.png',
              rating: 4
            },
            pickup: '123 Main St',
            dropoff: '456 Oak Ave',
            date: '2023-06-15',
            time: '08:30 AM',
            price: 25,
            status: 'Confirmed'
          },
          {
            id: 2,
            driver: {
              name: 'Sarah Smith',
              profilePic: '/default-profile.png',
              rating: 5
            },
            pickup: '100 Park Ave',
            dropoff: '200 Central St',
            date: '2023-06-18',
            time: '09:00 AM',
            price: 20,
            status: 'Confirmed'
          },
          {
            id: 3,
            driver: {
              name: 'Mike Johnson',
              profilePic: '/default-profile.png',
              rating: 4
            },
            pickup: '300 River Rd',
            dropoff: '400 Lake View',
            date: '2023-06-20',
            time: '10:30 AM',
            price: 35,
            status: 'Pending'
          }
        ],
        offering: [
          {
            id: 1,
            pickup: '789 Pine Rd',
            dropoff: '321 Elm Blvd',
            date: '2023-06-16', 
            time: '05:00 PM',
            price: 30,
            passengers: 2,
            seats: 4
          },
          {
            id: 2,
            pickup: '500 Hill St',
            dropoff: '600 Valley Dr',
            date: '2023-06-19', 
            time: '07:00 AM',
            price: 40,
            passengers: 1,
            seats: 3
          },
          {
            id: 3,
            pickup: '700 Beach Ave',
            dropoff: '800 Mountain Rd',
            date: '2023-06-22', 
            time: '03:30 PM',
            price: 45,
            passengers: 3,
            seats: 5
          }
        ]
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
      {!isOffering && ride.driver && (
        <div className="flex items-center mb-4">
          <img
            src={ride.driver.profilePic || '/default-profile.png'}
            alt={ride.driver.name}
            className="h-10 w-10 rounded-full mr-3 object-cover"
          />
          <div>
            <h3 className="text-md font-medium text-gray-900">{ride.driver.name}</h3>
            {renderStars(ride.driver.rating)}
          </div>
          <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
            ride.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {ride.status || 'Pending'}
          </span>
        </div>
      )}
      <div className="flex mb-2">
        <div className="w-1/2">
          <p className="text-xs text-gray-500">FROM</p>
          <p className="text-sm font-medium">{ride.pickup}</p>
        </div>
        <div className="w-1/2">
          <p className="text-xs text-gray-500">TO</p>
          <p className="text-sm font-medium">{ride.dropoff}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-xs">{ride.date}</p>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-xs">{ride.time}</p>
          </div>
        </div>
        <p className="text-lg font-bold text-indigo-600">${ride.price || 0}</p>
      </div>
      {isOffering && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              {ride.passengers || 0} of {ride.seats || 4} seats booked
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-2 bg-indigo-600 rounded-full" 
                style={{ width: `${((ride.passengers || 0) / (ride.seats || 4)) * 100}%` }}
              ></div>
            </div>
          </div>
          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-1 px-3 rounded-md text-sm transition duration-300">
            Manage
          </button>
        </div>
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
        {activeTab === 'joined' && myRides.joined.map(ride => renderRideCard(ride))}
        {activeTab === 'offering' && myRides.offering.map(ride => renderRideCard(ride, true))}
      </div>
    </div>
  );
}

export default RideOffer;
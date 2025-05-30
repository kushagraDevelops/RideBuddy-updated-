import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Filter, ChevronDown, Plus, MessageCircle, X, Send } from 'lucide-react';
import './index.css';
import Form from './parts/form';

const RideBuddyPage = () => {
  const location = useLocation();
  const { from, to, pickupDate } = location.state || {};

  // Updated: manage additional backend data
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('joined');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('earliest');

  // Chat state variables (missing in original)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);

  // Handle sending chat messages
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages(prev => [
        ...prev,
        { text: messageInput, isBot: false },
        { text: "Thanks for your message! Our support team will get back to you soon.", isBot: true }
      ]);
      setMessageInput('');
    }
  };

  // Fetch rides and extra info based on search criteria
  useEffect(() => {
    if (from && to && pickupDate) {
      setIsLoading(true);
      fetch(
        `http://localhost:5000/api/rides/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${pickupDate}`
      )
        .then((res) => res.json())
        .then((data) => {
          setRides(data.rides || []);
          setStats(data.stats || {});
          setApiMessage(data.message || '');
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching rides:', err);
          setError('Failed to fetch rides');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setRides([]);
      setStats({});
      setApiMessage('');
    }
  }, [from, to, pickupDate]);

  // Render star ratings
  const renderStars = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation-> a navbar component is added in the app.js already  */}

      {/* Hero Section */}
      <div className="relative bg-[#483C46] text-white">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/api/placeholder/1200/400')" }}
        ></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-5xl">Find or Offer a Ride Easily!</h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl">Connect with travelers heading your way and share the journey.</p>
        </div>
      </div>

      {/* Search Section */}
      <Form/>

      {/* Available Rides Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Rides</h2>
          <div className="flex flex-col sm:flex-row mt-4 md:mt-0 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Price Range</label>
                      <input type="range" min="0" max="100" className="w-full" />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                      <select className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option>Any rating</option>
                        <option>4+ stars</option>
                        <option>4.5+ stars</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Seats Available</label>
                      <select className="block w-full border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option>Any number</option>
                        <option>1+</option>
                        <option>2+</option>
                        <option>3+</option>
                      </select>
                    </div>
                    <button className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 mt-2">
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <option value="earliest">Earliest Departure</option>
              <option value="lowest">Lowest Price</option>
            </select>
          </div>
        </div>

        {/* API message and stats */}
        {apiMessage && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-900 rounded">
            {apiMessage}
          </div>
        )}
        {stats.total !== undefined && (
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">{stats.total}</span> rides found.
            {stats.average_price && (
              <> Average price: <span className="font-semibold">Rs.{stats.average_price}</span></>
            )}
          </div>
        )}

        {/* Ride Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <div className="col-span-full text-center py-8">Loading rides...</div>}
          {error && <div className="col-span-full text-red-500 text-center py-8">{error}</div>}
          {!isLoading && rides.length === 0 && (
            <div className="col-span-full text-gray-500 text-center py-8">No rides found for your criteria.</div>
          )}
          {rides.map((ride) => (
            <div
              key={ride.ride_id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={"/api/placeholder/60/60"}
                    alt={ride.driver_name || "Driver"}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{ride.driver_name || "Driver"}</h3>
                    {renderStars(ride.driver_rating || 4)}
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">FROM</p>
                      <p className="text-sm font-medium">{ride.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">TO</p>
                      <p className="text-sm font-medium">{ride.destination}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-sm">
                        {ride.departure_time
                          ? new Date(ride.departure_time).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <p className="text-sm">
                        {ride.departure_time
                          ? new Date(ride.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{ride.available_seats} seats available</p>
                    <p className="text-xl font-bold text-indigo-600">Rs.{ride.price_per_seat}</p>
                    <p className="text-xs text-gray-500">per seat</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300">
                    Request to Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Offer a Ride Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center mx-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Offer a Ride
        </button>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform duration-300 transform hover:scale-110"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        )}
        
        {/* Chat Window */}
        {isChatOpen && (
          <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 h-96 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">RideBuddy Support</h3>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg p-3 ${
                        msg.isBot 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideBuddyPage;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Filter, ChevronDown, Plus, MessageCircle, X, Send } from 'lucide-react';
import './index.css';
import Form from './parts/form';

const RideBuddyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get initial search parameters from location.state or URL params
  const getInitialSearchParams = () => {
    // First check location.state (from homepage navigation)
    if (location.state?.from && location.state?.to && location.state?.pickupDate) {
      return {
        from: location.state.from,
        to: location.state.to,
        date: location.state.pickupDate
      };
    }
    
    // Then check URL parameters (for direct access or page refresh)
    const urlParams = new URLSearchParams(location.search);
    return {
      from: urlParams.get('from') || '',
      to: urlParams.get('to') || '',
      date: urlParams.get('date') || ''
    };
  };

  const [searchParams, setSearchParams] = useState(getInitialSearchParams());
  
  // Updated: manage additional backend data
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('joined');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('earliest');

  // Chat state variables
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

  // Function to fetch rides from API
  const fetchRides = async (params) => {
  if (!params.from || !params.to || !params.date) {
    setRides([]);
    setStats({});
    setApiMessage('');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    
    const response = await fetch(
      `http://localhost:5000/api/rides/search?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}&date=${params.date}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle your exact backend response structure
    setRides(data.rides || []);
    setStats(data.stats || {});
    setApiMessage(data.message || '');
    
    console.log('Backend response:', data); // For debugging
    
  } catch (err) {
    console.error('Error fetching rides:', err);
    setError('Failed to fetch rides. Please check your connection and try again.');
    setRides([]);
    setStats({});
    setApiMessage('');
  } finally {
    setIsLoading(false);
  }
};

  // Handle search from Form component
  const handleSearch = async (formData) => {
    setSearchParams(formData);
    
    // Update URL with new search parameters
    const newUrlParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date
    });
    
    // Update the URL without causing a page reload
    navigate(`${location.pathname}?${newUrlParams}`, { replace: true });
    
    // Fetch rides with new parameters
    await fetchRides(formData);
  };

  // Initial fetch when component mounts or search parameters change
  useEffect(() => {
    if (searchParams.from && searchParams.to && searchParams.date) {
      fetchRides(searchParams);
    }
  }, []);

  // Update URL parameters when component mounts with location.state
  useEffect(() => {
    if (location.state?.from && location.state?.to && location.state?.pickupDate) {
      const urlParams = new URLSearchParams({
        from: location.state.from,
        to: location.state.to,
        date: location.state.pickupDate
      });
      navigate(`${location.pathname}?${urlParams}`, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

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
      <Form 
        onSearch={handleSearch}
        initialValues={searchParams}
      />

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

        {/* Search Status */}
        {searchParams.from && searchParams.to && searchParams.date && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Searching rides from {searchParams.from} to {searchParams.to}
            </h3>
            <p className="text-blue-700">
              Date: {new Date(searchParams.date).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* API message and stats */}
       
       {stats.total !== undefined && (
  <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <span className="text-2xl font-bold text-indigo-600">{stats.total}</span>
        <span className="text-gray-600 ml-2">rides found</span>
      </div>
      {stats.average_price && stats.average_price > 0 && (
        <div>
          <span className="text-2xl font-bold text-green-600">
            ₹{Math.round(stats.average_price)}
          </span>
          <span className="text-gray-600 ml-2">average price</span>
        </div>
      )}
    </div>
  </div>
)}



        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-900 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for rides...</p>
          </div>
        )}

        {/* No Search Criteria */}
        {!searchParams.from && !searchParams.to && !searchParams.date && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Search for Rides</h3>
            <p className="text-gray-600">Use the search form above to find rides matching your criteria.</p>
          </div>
        )}

        {/* Ride Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.length === 0 && searchParams.from && searchParams.to && searchParams.date && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No rides found</h3>
                  <p>Try adjusting your search criteria or check back later for new rides.</p>
                </div>
              </div>
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
                      <p className="text-xl font-bold text-indigo-600">₹{ride.price_per_seat}</p>
                      <p className="text-xs text-gray-500">per seat</p>
                    </div>
               <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300"
                      aria-label="Request to Join Ride"
                  onClick={()=>{
                      const token = localStorage.getItem('token');
                      if (!token) {
                        navigate('/auth', { state: { from: `/ride/${ride.ride_id}/confirm` } });
                      } else {
                        navigate(`/ride/${ride.ride_id}/confirm`);
                      }                    }}>
                       Request to Join
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Offer a Ride Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <button
          onClick={() => navigate('/postride')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center mx-auto"
          
        >
          <Plus className="h-5 w-5 mr-2" />
          Offer a Ride
        </button>
      </div>

     
       
            
          
            
         
      </div>
    
  );
};

export default RideBuddyPage;




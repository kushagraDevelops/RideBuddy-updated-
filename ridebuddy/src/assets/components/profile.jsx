import { useEffect, useState } from 'react';
import { Star, Edit, Key, Clock, LogOut, Award, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '', 
    username: '',
    email: '',
    phone: '',  
    profileImage: 'https://via.placeholder.com/150', // Fixed: Only one profileImage field
    verified: false,
    rating: 0,  
    type: '',
    recentRides: [],
  });
  
  // Updated Indian user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Adjust based on your auth setup
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) { 
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserData();
  }, []);

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="text-yellow-500 fill-yellow-500" size={20} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="text-yellow-500 fill-yellow-500" size={20} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={20} />);
      }
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h1>
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* Profile Image */}
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="relative">
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-sm"
                  />
                  {user.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  {user.verified && (
                    <div className="ml-2 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-gray-500 mb-2">@{user.username}</p>
                
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="flex mr-2">
                    {renderStars(user.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">{user.rating}/5</span>
                </div>
                
                <div className="bg-green-50 text-green-800 inline-block px-3 py-1 rounded-full text-sm font-medium">
                  {user.type}
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="p-6 border-t border-green-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={18} className="text-green-600 mr-3" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-green-600 mr-3" />
                <span className="text-gray-600">{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 border-t border-green-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button className="flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg transition-colors duration-200">
                <Edit size={18} className="mr-2" />
                Edit Profile
              </button>
              <button className="flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg transition-colors duration-200">
                <Key size={18} className="mr-2" />
                Change Password
              </button>
              <button className="flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg transition-colors duration-200">
                <Clock size={18} className="mr-2" />
                Ride History
              </button>
              <button className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg transition-colors duration-200">
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Rides */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
          <div className="p-6 border-b border-green-100">
            <h3 className="text-lg font-semibold text-gray-700">Recent Rides</h3>
          </div>
          
          <div className="divide-y divide-green-100">
            {user.recentRides && user.recentRides.length > 0 ? (
              user.recentRides.map(ride => (
                <div key={ride.id} className="p-5 hover:bg-green-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{ride.date} at {ride.time}</p>
                      <div className="flex items-start mb-2">
                        <MapPin size={18} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700">{ride.pickup}</p>
                          <p className="text-sm text-gray-500">to {ride.dropoff}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        ride.role === 'Driver' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {ride.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-gray-500">
                <p>No recent rides found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-green-50 text-center">
            <button className="text-green-700 hover:text-green-900 text-sm font-medium transition-colors duration-200">
              View All Rides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
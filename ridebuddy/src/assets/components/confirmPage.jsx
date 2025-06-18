import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, User, Phone, Star, X } from 'lucide-react';

const ConfirmationPage = () => {
  const { rideId } = useParams();
  const [rideData, setRideData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
  fetch(`http://localhost:5000/api/rides/${rideId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => setRideData(data.ride))
    .catch(err => {
      console.error('Failed to fetch ride:', err);
      // Optionally show error to user
    });
}, [rideId]);

    const handleConfirm = async () => {
    setIsLoading(true);
    // TODO: Send booking request to backend here
    setIsLoading(false);
    setConfirmed(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  if (!showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Sent Successfully!</h2>
          <p className="text-gray-600">You'll be notified once the driver responds.</p>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, rgba(220, 252, 231, 0.8), rgba(187, 247, 208, 0.8))
        `,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full transform animate-pulse">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h3>
          <p className="text-gray-600">{rideData?.driver_name || 'Driver'} will be notified about your request.</p>
        </div>
      </div>
    );
  }

  if (!rideData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{
      background: `
        radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, rgba(220, 252, 231, 0.8), rgba(187, 247, 208, 0.8))
      `,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-3xl relative">
          <button 
            onClick={() => setShowConfirmation(false)}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Confirm Your Ride</h2>
          <p className="text-green-100">Review details before requesting</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Driver Info */}
          <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-2xl border border-green-100">
            <img 
              src={"/api/placeholder/60/60"}
              alt={rideData.driver_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">{rideData.driver_name}</h3>
              {/* If you have driver rating/phone, render here */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{rideData.driver_rating || 'N/A'}</span>
                {/* <span>•</span>
                <Phone className="w-4 h-4" />
                <span>{rideData.driver_phone || 'N/A'}</span> */}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg">Route Details</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-800">From</p>
                  <p className="text-gray-600 text-sm">{rideData.origin}</p>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-green-300 h-8"></div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-800">To</p>
                  <p className="text-gray-600 text-sm">{rideData.destination}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">
                  {rideData.departure_time
                    ? new Date(rideData.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">
                  {rideData.departure_time
                    ? new Date(rideData.departure_time).toLocaleDateString()
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Schedule & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h5 className="font-semibold text-gray-800 mb-2">Schedule</h5>
              <p className="text-sm text-gray-600 mb-1">
                {rideData.departure_time
                  ? new Date(rideData.departure_time).toLocaleDateString()
                  : ''}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {rideData.departure_time
                  ? new Date(rideData.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <h5 className="font-semibold text-gray-800 mb-2">Price</h5>
              <p className="text-2xl font-bold text-green-600">Rs.{rideData.price_per_seat}</p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
          </div>

          {/* Available Seats */}
          <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-gray-800">Available Seats</span>
            </div>
            <span className="font-bold text-amber-600">{rideData.available_seats} left</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Request to Join</span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="bg-green-50 p-4 rounded-b-3xl border-t border-green-100">
          <p className="text-xs text-green-700 text-center">
            🌱 By carpooling, you're helping reduce carbon emissions and traffic congestion!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;



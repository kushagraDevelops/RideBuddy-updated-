import React, { useState } from 'react';
import { Check, X, User, MapPin, Calendar, Clock, Phone, Mail, Car, Users, ArrowLeft } from 'lucide-react';

const RideBookingManager = ({ rideId, rideDetails, onBack }) => {
  // Sample data - in real app, this would be filtered by rideId from your API
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      rideId: 'R001',
      passengerName: 'Rahul Sharma',
      passengerEmail: 'rahul.sharma@email.com',
      passengerPhone: '+91 9876543210',
      requestedSeats: 2,
      totalFare: 800,
      requestDate: '2025-06-25',
      requestTime: '14:30',
      status: 'pending',
      passengerRating: 4.5,
      passengerTrips: 15,
      passengerAvatar: 'RS'
    },
    {
      id: 2,
      rideId: 'R001',
      passengerName: 'Priya Patel',
      passengerEmail: 'priya.patel@email.com',
      passengerPhone: '+91 9876543211',
      requestedSeats: 1,
      totalFare: 400,
      requestDate: '2025-06-26',
      requestTime: '16:45',
      status: 'pending',
      passengerRating: 4.8,
      passengerTrips: 23,
      passengerAvatar: 'PP'
    },
    {
      id: 3,
      rideId: 'R001',
      passengerName: 'Arjun Kumar',
      passengerEmail: 'arjun.kumar@email.com',
      passengerPhone: '+91 9876543212',
      requestedSeats: 1,
      totalFare: 400,
      requestDate: '2025-06-27',
      requestTime: '10:15',
      status: 'confirmed',
      passengerRating: 4.2,
      passengerTrips: 8,
      passengerAvatar: 'AK'
    },
    {
      id: 4,
      rideId: 'R001',
      passengerName: 'Sneha Reddy',
      passengerEmail: 'sneha.reddy@email.com',
      passengerPhone: '+91 9876543213',
      requestedSeats: 2,
      totalFare: 800,
      requestDate: '2025-06-24',
      requestTime: '12:30',
      status: 'rejected',
      passengerRating: 4.6,
      passengerTrips: 12,
      passengerAvatar: 'SR'
    }
  ]);

  // Default ride details if not provided
  const defaultRideDetails = {
    id: rideId || 'R001',
    title: 'Mumbai to Pune',
    from: 'Andheri Station, Mumbai',
    to: 'Pune Station, Pune',
    date: '2025-07-02',
    time: '09:00',
    availableSeats: 4,
    pricePerSeat: 400,
    totalDistance: '148 km',
    estimatedDuration: '3h 30m'
  };

  const currentRide = rideDetails || defaultRideDetails;
  
  // Filter requests for current ride
  const rideRequests = bookingRequests.filter(request => request.rideId === currentRide.id);

  const handleConfirm = (requestId) => {
    setBookingRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'confirmed' }
          : request
      )
    );
  };

  const handleReject = (requestId) => {
    setBookingRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' }
          : request
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'confirmed':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const pendingRequests = rideRequests.filter(req => req.status === 'pending');
  const confirmedRequests = rideRequests.filter(req => req.status === 'confirmed');
  const rejectedRequests = rideRequests.filter(req => req.status === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
          <div className="flex items-center mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage Ride Requests</h1>
              <p className="text-gray-600 text-sm">Ride ID: {currentRide.id}</p>
            </div>
          </div>

          {/* Ride Details Card */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{currentRide.title}</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2 text-green-600" size={16} />
                  <span>{currentRide.from}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2 text-red-500" size={16} />
                  <span>{currentRide.to}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2 text-blue-500" size={16} />
                  <span>{currentRide.date} at {currentRide.time}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="mr-2 text-purple-500" size={16} />
                  <span>{currentRide.availableSeats} seats • ₹{currentRide.pricePerSeat}/seat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              <span className="text-yellow-800 font-semibold">{pendingRequests.length}</span>
              <span className="text-yellow-600 ml-1 text-sm">Pending</span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-800 font-semibold">{confirmedRequests.length}</span>
              <span className="text-green-600 ml-1 text-sm">Confirmed</span>
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <span className="text-red-800 font-semibold">{rejectedRequests.length}</span>
              <span className="text-red-600 ml-1 text-sm">Rejected</span>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2 text-yellow-500" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                        {request.passengerAvatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{request.passengerName}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-yellow-600 mr-2">★ {request.passengerRating}</span>
                          <span>{request.passengerTrips} trips completed</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Contact Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="mr-2" size={14} />
                          {request.passengerEmail}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="mr-2" size={14} />
                          {request.passengerPhone}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Booking Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seats:</span>
                          <span className="font-medium">{request.requestedSeats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Fare:</span>
                          <span className="font-medium text-green-600">₹{request.totalFare}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Requested:</span>
                          <span className="font-medium">{request.requestDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleConfirm(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Check className="mr-2" size={16} />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <X className="mr-2" size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Requests */}
        {confirmedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Check className="mr-2 text-green-500" />
              Confirmed Passengers ({confirmedRequests.length})
            </h2>
            <div className="grid gap-3">
              {confirmedRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {request.passengerAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{request.passengerName}</h3>
                        <p className="text-gray-600 text-sm">{request.requestedSeats} seat(s) • ₹{request.totalFare}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <X className="mr-2 text-red-500" />
              Rejected Requests ({rejectedRequests.length})
            </h2>
            <div className="grid gap-3">
              {rejectedRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {request.passengerAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{request.passengerName}</h3>
                        <p className="text-gray-600 text-sm">{request.requestedSeats} seat(s) • ₹{request.totalFare}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {rideRequests.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Booking Requests</h3>
            <p className="text-gray-600">This ride doesn't have any booking requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideBookingManager;
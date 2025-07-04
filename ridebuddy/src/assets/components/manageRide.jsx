import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, X, User, MapPin, Calendar, Clock, Phone, Mail, Car, Users, ArrowLeft, Loader } from 'lucide-react';

const RideBookingManager = ({ onBack }) => {
  const { rideId } = useParams(); // Get rideId from URL parameters
  console.log('Ride ID from URL:', rideId); // Debug log
  const [rideDetails, setRideDetails] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ride details and bookings
  useEffect(() => {
    const fetchRideData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage (you might need to adjust this based on your auth implementation)
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching data for ride ID:', rideId); // Debug log
        
        const response = await fetch(`http://localhost:5000/api/bookings/driver/${rideId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        // Set ride details
        setRideDetails(data.ride);
        
        // Transform bookings to match your existing component structure
        const transformedBookings = data.bookings.map(booking => ({
          id: booking.booking_id,
          rideId: rideId,
          passengerName: `${booking.first_name} ${booking.last_name}`,
          passengerEmail: booking.email,
          passengerPhone: booking.phone_number,
          requestedSeats: booking.seats_booked,
          totalFare: booking.total_amount,
          requestDate: new Date(booking.created_at).toLocaleDateString(),
          requestTime: new Date(booking.created_at).toLocaleTimeString(),
          status: booking.booking_status, // pending, confirmed, rejected
          passengerRating: booking.rating || 0,
          passengerTrips: 0, // You might want to add this to your database
          passengerAvatar: booking.profile_pic || `${booking.first_name.charAt(0)}${booking.last_name.charAt(0)}`,
          userId: booking.passenger_id
        }));
        
        setBookingRequests(transformedBookings);
      } catch (err) {
        console.error('Error fetching ride data:', err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      fetchRideData();
    } else {
      setError('No ride ID provided');
      setLoading(false);
    }
  }, [rideId]);

  const handleConfirm = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`http://localhost:5000/api/bookings/${requestId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookingRequests(prev => 
          prev.map(request => 
            request.id === requestId 
              ? { ...request, status: 'confirmed' }
              : request
          )
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to confirm booking');
      }
    } catch (err) {
      console.error('Error confirming booking:', err);
      alert('Error confirming booking: ' + err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`/api/bookings/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookingRequests(prev => 
          prev.map(request => 
            request.id === requestId 
              ? { ...request, status: 'rejected' }
              : request
          )
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reject booking');
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert('Error rejecting booking: ' + err.message);
    }
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

  // Format date and time
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Not specified';
    return `${new Date(dateStr).toLocaleDateString()} at ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex items-center">
          <Loader className="animate-spin mr-3 text-green-600" size={24} />
          <span className="text-gray-700">Loading ride details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Ride</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Car className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ride Not Found</h3>
          <p className="text-gray-600">The requested ride could not be found.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const pendingRequests = bookingRequests.filter(req => req.status === 'pending');
  const confirmedRequests = bookingRequests.filter(req => req.status === 'confirmed');
  const rejectedRequests = bookingRequests.filter(req => req.status === 'rejected');

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
              <p className="text-gray-600 text-sm">Ride ID: {rideDetails.ride_id}</p>
            </div>
          </div>

          {/* Ride Details Card */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {rideDetails.origin} → {rideDetails.destination}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2 text-green-600" size={16} />
                  <span>{rideDetails.origin}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2 text-red-500" size={16} />
                  <span>{rideDetails.destination}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2 text-blue-500" size={16} />
                  <span>
                    {formatDateTime(rideDetails.departure_date, rideDetails.departure_time)}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="mr-2 text-purple-500" size={16} />
                  <span>{rideDetails.available_seats} seats • ₹{rideDetails.price_per_seat}/seat</span>
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
                        {typeof request.passengerAvatar === 'string' && request.passengerAvatar.length <= 2 
                          ? request.passengerAvatar 
                          : request.passengerName.split(' ').map(n => n[0]).join('')}
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
                        {typeof request.passengerAvatar === 'string' && request.passengerAvatar.length <= 2 
                          ? request.passengerAvatar 
                          : request.passengerName.split(' ').map(n => n[0]).join('')}
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
                        {typeof request.passengerAvatar === 'string' && request.passengerAvatar.length <= 2 
                          ? request.passengerAvatar 
                          : request.passengerName.split(' ').map(n => n[0]).join('')}
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
        {bookingRequests.length === 0 && (
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


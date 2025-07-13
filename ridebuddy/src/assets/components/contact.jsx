import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User, Loader2, AlertCircle } from 'lucide-react';

function ContactModal({ isOpen, onClose, bookingId }) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch driver contact info when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchDriverContact();
    }
  }, [isOpen, bookingId]);

  const fetchDriverContact = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth setup
      
      const response = await fetch(`http://localhost:5000/api/bookings/contact/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch driver contact info');
      }

      const data = await response.json();
      setDriver(data.driver);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleClose = () => {
    setDriver(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition duration-300"
          >
            <X className="h-6 w-6" />
          </button>
          
          {loading ? (
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-700 animate-pulse" />
              <div>
                <div className="h-6 bg-indigo-700 rounded animate-pulse mb-2" />
                <div className="h-4 bg-indigo-700 rounded animate-pulse w-24" />
              </div>
            </div>
          ) : driver ? (
            <div className="flex items-center space-x-4">
              <img
                src={driver.profile_pic || '/default-profile.png'}
                alt={driver.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-white"
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                }}
              />
              <div>
                <h2 className="text-xl font-bold">{driver.name}</h2>
                <p className="text-indigo-100">Driver Contact</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-700 flex items-center justify-center">
                <User className="h-8 w-8 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Driver Contact</h2>
                <p className="text-indigo-100">Loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">Loading driver contact info...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchDriverContact}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {driver && !loading && !error && (
            <>
              {/* Phone Contact */}
              {driver.phone && (
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{driver.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePhoneCall(driver.phone)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300"
                    >
                      Call
                    </button>
                  </div>
                </div>
              )}

              {/* Email Contact */}
              {driver.email && (
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{driver.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEmailClick(driver.email)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-300"
                    >
                      Email
                    </button>
                  </div>
                </div>
              )}

              {/* No Contact Info Available */}
              {!driver.phone && !driver.email && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    No contact information available for this driver.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={handleClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-sm transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
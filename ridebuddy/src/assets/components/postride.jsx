import { useState } from 'react';
import { Car, MapPin, Calendar, Users, DollarSign, FileText, Check, Leaf } from 'lucide-react';

export default function PostRideForm() {
  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    dateTime: '',
    seats: '',
    price: '',
    notes: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/rides/postride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optionally, add Authorization header if using JWT:
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setShowSuccess(true);
      setFormData({
        startLocation: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        expectedReachingTime: '',
        seats: '',
        price: '',
        notes: ''
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to post ride');
    }
  } catch (err) {
    alert('Failed to connect to server');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
         
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">Post a Ride</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starting Location */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="startLocation">
                  Starting Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-green-500" />
                  </div>
                  <input
                    type="text"
                    id="startLocation"
                    name="startLocation"
                    value={formData.startLocation}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
                    placeholder="Enter pickup location"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="destination">
                  Destination <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-green-500" />
                  </div>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
                    placeholder="Enter drop-off location"
                  />
                </div>
              </div>

            {/* Departure Date */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="departureDate">
    Departure Date <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Calendar className="h-5 w-5 text-green-500" />
    </div>
    <input
      type="date"
      id="departureDate"
      name="departureDate"
      value={formData.departureDate}
      onChange={handleChange}
      required
      className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
    />
  </div>
</div>

{/* Departure Time */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="departureTime">
    Departure Time <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Calendar className="h-5 w-5 text-green-500" />
    </div>
    <input
      type="time"
      id="departureTime"
      name="departureTime"
      value={formData.departureTime}
      onChange={handleChange}
      required
      className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
    />
  </div>
</div>

{/* Expected Reaching Time */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="expectedReachingTime">
    Expected Reaching Time <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Calendar className="h-5 w-5 text-green-500" />
    </div>
    <input
      type="time"
      id="expectedReachingTime"
      name="expectedReachingTime"
      value={formData.expectedReachingTime}
      onChange={handleChange}
      required
      className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
    />
  </div>
</div>

              {/* Number of Seats */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="seats">
                  Available Seats <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <select
                    id="seats"
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
                  >
                    <option value="">Select seats</option>
                    <option value="1">1 seat</option>
                    <option value="2">2 seats</option>
                    <option value="3">3 seats</option>
                    <option value="4">4 seats</option>
                    <option value="5">5 seats</option>
                    <option value="6">6+ seats</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
                  Price per Seat (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
                    placeholder="Enter price per seat"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="notes">
                  Additional Notes (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-green-500 focus:ring-green-500 outline-none border"
                    placeholder="Enter any additional details about your ride..."
                  />
                </div>
              </div>
            </div>

            {/* CO2 Savings Message */}
            <div className="my-6 flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">
                By carpooling, you'll help reduce CO2 emissions and traffic congestion!
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="py-3 px-8 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-300 flex items-center"
              >
                <Car className="mr-2 h-5 w-5" />
                Post Your Ride
              </button>
            </div>
          </form>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
            <Check className="mr-2 h-5 w-5" />
            <span>Ride posted successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
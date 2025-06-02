import React, { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

function Form({ onSearch, initialValues = {} }) {
  const [formData, setFormData] = useState({
    from: initialValues.from || '',
    to: initialValues.to || '',
    date: initialValues.date || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.from.trim()) {
      alert('Please enter pickup location');
      return;
    }
    if (!formData.to.trim()) {
      alert('Please enter drop-off location');
      return;
    }
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('Please select a date that is today or in the future');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the parent component's search handler
      await onSearch(formData);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search rides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-10">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* From Location */}
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="Pickup Location"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* To Location */}
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="Drop-off Location"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Date */}
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
            </div>
            
            {/* Search Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[#333333] hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Rides
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
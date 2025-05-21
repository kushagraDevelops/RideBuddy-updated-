import React, { useState } from 'react';
import { Search, Menu, X, User, Calendar, Clock, MapPin, Star, Filter, ChevronDown, Plus } from 'lucide-react';
;


function Form(){
    return(
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pickup Location"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Drop-off Location"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button className="bg-[#333333] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Search Rides
            </button>
          </div>
        </div>
      </div>

    )
}

export default Form;



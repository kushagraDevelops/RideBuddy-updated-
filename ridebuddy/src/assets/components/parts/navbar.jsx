import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, Calendar, Clock, MapPin, Star, Filter, ChevronDown, Plus } from 'lucide-react';


function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
          <nav className="bg-[#3A7D44] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <span className="text-xl font-bold">RideBuddy</span>
                    </div>
                   
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                      <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#333333]">Home</Link>

                      <Link to="/ridepage" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#333333]">Find Ride</Link>
                      
                      <Link to="/postride" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#333333]">Offer Ride</Link>

                      <Link to="/MyRides" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#333333]">My Rides</Link>

                      <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#333333]">Profile</Link>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none"
                      >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>
                </div>
        
                {/* Mobile menu */}
                {isMenuOpen && (
                  <div className="md:hidden bg-green-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                      <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500">Home</Link>
                      <Link to="/ridepage" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500">Find Ride</Link>
                      <Link to="/postride" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500">Offer Ride</Link>
                      <Link to="/MyRides" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500">My Rides</Link>
                      <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500">Profile</Link>
                    </div>
                  </div>
                )}
              </nav>
    )

}


export default Navbar;



import React, { useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Users, Globe, Star, ArrowRight, CheckCircle, Award, Shield } from 'lucide-react';

const RideBuddyHomepage = () => {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [rideCount, setRideCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const handleSearch = () => {
    console.log('Searching with:', { location, pickupDate, returnDate });
  };

  // Animation for counter
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (rideCount < 15000) setRideCount(prev => Math.min(prev + 250, 15000));
      if (co2Count < 3500) setCo2Count(prev => Math.min(prev + 50, 3500));
      if (userCount < 5000) setUserCount(prev => Math.min(prev + 100, 5000));
    }, 50);

    return () => clearInterval(intervalId);
  }, [rideCount, co2Count, userCount]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Martinez",
      text: "RideBuddy made my daily commute so much more affordable and I've met some amazing people along the way!",
      rating: 5,
      location: "Portland, OR"
    },
    {
      id: 2,
      name: "Michael Chen",
      text: "As a student, this app has been a lifesaver. I save money on gas and do my part for the environment.",
      rating: 5, 
      location: "Boston, MA"
    },
    {
      id: 3,
      name: "Jamie Wilson",
      text: "The interface is so intuitive and finding regular carpool buddies has never been easier.",
      rating: 4,
      location: "Austin, TX"
    }
  ];

  const partners = [
    { name: "GreenTech", color: "bg-green-100" },
    { name: "EcoTrans", color: "bg-green-50" },
    { name: "CityMove", color: "bg-blue-50" },
    { name: "SafeRide", color: "bg-yellow-50" }
  ];

  const features = [
    { 
      icon: <Car size={32} className="text-green-600" />,
      title: "Smart Matching",
      description: "Our algorithm matches you with compatible riders based on routes and schedules."
    },
    { 
      icon: <Users size={32} className="text-green-600" />,
      title: "Community Ratings",
      description: "Verified reviews and ratings help you choose trustworthy ride partners."
    },
    { 
      icon: <Globe size={32} className="text-green-600" />,
      title: "Eco Impact",
      description: "Track your carbon footprint reduction with every shared ride."
    },
    { 
      icon: <Shield size={32} className="text-green-600" />,
      title: "Safe Journeys",
      description: "ID verification and trip monitoring ensure maximum safety."
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Full page background color covering white space */}
      <div className="fixed inset-0 bg-[#D5E0D2] -z-10"></div>
      {/* Original Green Semicircle Background (unchanged) */}
      <div className="absolute top-0 left-0 w-[60%] h-full bg-[#9DC08B] rounded-r-[50%] z-0"></div>

      <div className="relative z-10 container mx-auto px-8 mt-12 grid md:grid-cols-2 gap-8 items-center">
        
        {/* Text Section */}
        <div>
          <h1 className="text-5xl font-extrabold text-green-900 text-opacity-8 ml-12 mb-12">
            Smarter rides,
            <br />
            Greener roads.
          </h1>

          {/* Search Form - Modern and Sleek */}
          <div className="mt-25 mb-8">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full mx-4 border border-gray-200">
              <div className="flex items-end gap-4">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {/* Location Input */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      placeholder="Where from?" 
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      placeholder="Where to?" 
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {/* Pickup Date */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Pickup</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>

                
                </div>
                
                {/* Search Button - Right side */}
                <Link to ="/ridepage">
                <button 
                  onClick={handleSearch}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg h-[46px]"
                >
                  Search
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vehicle Image */}
        <div className="flex justify-center items-center">
          <img 
            src="van.png" 
            alt="White van" 
            // className="w-full max-w-[800px] h-auto" 
          />
        </div>
      </div>


      
      
      {/* NEW SECTIONS BELOW - Stats Counter Section with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container -mt-16 mb-4 mx-auto px-8 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center transform transition-all duration-300 hover:scale-105">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-green-600 mb-2"
            >
              {rideCount.toLocaleString()}+
            </motion.div>
            <p className="text-gray-700 font-medium">Rides Shared</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center transform transition-all duration-300 hover:scale-105">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-green-600 mb-2"
            >
              {co2Count.toLocaleString()}+ tons
            </motion.div>
            <p className="text-gray-700 font-medium">CO₂ Saved</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center transform transition-all duration-300 hover:scale-105">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold text-green-600 mb-2"
            >
              {userCount.toLocaleString()}+
            </motion.div>
            <p className="text-gray-700 font-medium">Happy Commuters</p>
          </div>
        </div>
      </motion.div>
      
      {/* Feature Section */}
      <div className="relative z-10 bg-gradient-to-b from-transparent to-green-100 py-16">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-green-800 mb-4">Why Choose RideBuddy?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the way people commute by making carpooling easy, affordable, and eco-friendly.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="p-3 bg-green-50 rounded-full inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="relative z-10 py-16 bg-white">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-green-800 mb-4">How RideBuddy Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to start saving money and reducing your carbon footprint</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative text-center p-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Enter Your Route</h3>
              <p className="text-gray-600">Tell us where you're going and when you need to travel</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative text-center p-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Match with Riders</h3>
              <p className="text-gray-600">We'll connect you with compatible riders heading your way</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative text-center p-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Share & Save</h3>
              <p className="text-gray-600">Share the ride, split the cost, and reduce emissions together</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="relative z-10 py-16 bg-green-50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-green-800 mb-4">What Our Riders Say</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <div className="font-medium text-green-800">{testimonial.name}</div>
                <div className="text-gray-500 text-sm">{testimonial.location}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Partners Section */}
      
      
      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-16 bg-gradient-to-r from-green-600 to-green-800"
      >
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Join the Movement?</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-8">
            Start saving money, making connections, and reducing your carbon footprint today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
          >
            Get Started <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Download the App Section */}
      <div className="relative z-10 py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-green-800 mb-4">RideBuddy in Your Pocket</h2>
                <p className="text-gray-700 mb-6">
                  Get instant access to rides, real-time tracking, and seamless payment options with our mobile app.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition-all">
                    <div className="mr-2">
                      <svg width="20" height="24" viewBox="0 0 20 24" className="fill-current">
                        <path d="M16.4 12.8c-.034-3.248 2.656-4.8 2.776-4.876-1.52-2.22-3.876-2.526-4.704-2.56-1.984-.206-3.904 1.18-4.92 1.18-1.036 0-2.604-1.16-4.304-1.124-2.18.034-4.216 1.296-5.344 3.252-2.304 4-.586 9.86 1.626 13.08 1.104 1.578 2.392 3.334 4.08 3.266 1.648-.066 2.264-1.044 4.248-1.044 1.968 0 2.536 1.044 4.248.998 1.76-.03 2.866-1.566 3.928-3.16 1.26-1.78 1.768-3.532 1.782-3.62-.04-.014-3.386-1.292-3.416-5.16zm-3.204-9.48c.884-1.094 1.48-2.58 1.32-4.08-1.268.054-2.847.912-3.758 2.04-.81.944-1.534 2.478-1.35 3.92 1.424.104 2.88-.72 3.788-1.88z" />
                      </svg>
                    </div>
                    App Store
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-800 transition-all">
                    <div className="mr-2">
                      <svg width="22" height="24" viewBox="0 0 22 24" className="fill-current">
                        <path d="M17.6 8.4l4.6-4.5L19.5.7 14.8 5c-1.2-.7-2.6-1.1-4.1-1.1-1.5 0-2.9.4-4.1 1.1L1.9.7.2 3.9l4.6 4.5C2.9 10.7 1.8 13.7 1.8 17s1.1 6.3 2.9 8.6L.2 30.1l1.7 3.2 4.6-4.5c1.2.7 2.6 1.1 4.1 1.1 1.5 0 2.9-.4 4.1-1.1l4.6 4.5 1.7-3.2-4.6-4.5c1.9-2.3 2.9-5.3 2.9-8.6.1-3.3-.9-6.3-2.7-8.6zm-6.9 14.3c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8 5.8 2.6 5.8 5.8-2.6 5.8-5.8 5.8z" />
                      </svg>
                    </div>
                    Google Play
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="bg-gray-800 rounded-3xl p-2 shadow-xl w-64">
                  <div className="bg-green-50 rounded-2xl p-4 h-96 flex flex-col">
                    <div className="text-center font-bold text-green-800 text-lg mb-4">RideBuddy</div>
                    <div className="flex-1 bg-white rounded-lg mb-2"></div>
                    <div className="h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-medium">
                      Find a Ride
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to push footer down */}
      <div className="h-16 md:h-24"></div>
      
      {/* Footer with transparent background */}
      <footer className="absolute bottom-0 left-0 w-full bg-transparent text-gray-700 py-4 text-center">
        <p>&copy; 2023 RideBuddy. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

export default RideBuddyHomepage;

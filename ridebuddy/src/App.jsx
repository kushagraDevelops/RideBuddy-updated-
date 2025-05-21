import React from 'react'; // Import React
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/parts/navbar';
import RideBuddyHomepage from './assets/components/homepage';
import RideBuddyPage from './assets/components/ridepage';
import RideOffer from './assets/components/rideoffer';
import ProfilePage from './assets/components/profile';
import PostRideForm from './assets/components/postride';
import AuthForm from './assets/components/AuthForm';



function App() {
  return (  
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<RideBuddyHomepage />} />
        <Route path="/ridepage" element={<RideBuddyPage />} />
        <Route path="/RideOffer" element={<RideOffer />} />   
        <Route path="/profile" element={<ProfilePage />} />    
        <Route path="/postride" element={<PostRideForm />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/parts/navbar';
import RideBuddyHomepage from './assets/components/homepage';
import RideBuddyPage from './assets/components/ridepage';
import RideOffer from './assets/components/rideoffer';
import ProfilePage from './assets/components/profile';
import PostRideForm from './assets/components/postride';
import AuthForm from './assets/components/AuthForm';
import ProtectedRoute from './assets/components/protectedRoute';

function App() {
  return (  
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={
          <ProtectedRoute>
            <RideBuddyHomepage />
          </ProtectedRoute>
        } />
        <Route path="/ridepage" element={
          <ProtectedRoute>
            <RideBuddyPage />
          </ProtectedRoute>
        } />
        <Route path="/RideOffer" element={
          <ProtectedRoute>
            <RideOffer />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/postride" element={
          <ProtectedRoute>
            <PostRideForm />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


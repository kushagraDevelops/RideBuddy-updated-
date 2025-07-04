import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/parts/navbar';
import RideBuddyHomepage from './assets/components/homepage';
import RideBuddyPage from './assets/components/ridepage';
import MyRides from './assets/components/myRides';
import ProfilePage from './assets/components/profile';
import PostRideForm from './assets/components/postride';
import AuthForm from './assets/components/AuthForm';
import ProtectedRoute from './assets/components/protectedRoute';
import ConfirmationPage from './assets/components/confirmPage';
import RideBookingManager from './assets/components/manageRide';

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
        <Route path="/MyRides" element={
          <ProtectedRoute>
            <MyRides />
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
         <Route path="/ride/:rideId/confirm" element={
          <ProtectedRoute>
            < ConfirmationPage/>
          </ProtectedRoute>
        } />\
         <Route path="MyRides/manage/:rideId" element={
          <ProtectedRoute>
            <RideBookingManager />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;






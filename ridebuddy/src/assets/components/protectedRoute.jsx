import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";



function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'user' && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

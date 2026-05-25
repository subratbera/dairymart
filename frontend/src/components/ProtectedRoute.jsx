import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in, but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

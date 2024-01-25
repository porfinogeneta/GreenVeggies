import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoutes = ({ role }) => {
  const { auth, loading, error } = useAuth(role);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !auth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;

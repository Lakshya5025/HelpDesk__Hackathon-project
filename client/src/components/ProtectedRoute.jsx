import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  // While the session check is running, show a loading message
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // After the check, if there's still no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, show the requested page
  return <Outlet />;
};

export default ProtectedRoute;

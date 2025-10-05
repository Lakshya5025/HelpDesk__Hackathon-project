import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

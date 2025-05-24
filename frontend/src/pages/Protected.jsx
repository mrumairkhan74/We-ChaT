import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API;
const Protected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/verify`, { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    // Show a loading indicator or message while checking authentication
    return (
      <p className="relative w-full h-screen flex justify-center items-center">
        Verifying...
      </p>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default Protected;

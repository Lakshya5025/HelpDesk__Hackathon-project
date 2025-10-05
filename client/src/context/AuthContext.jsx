import axios from "axios";
import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  useEffect(() => {
    // This function will run once when the app loads
    const checkUserSession = async () => {
      try {
        // Check for a valid cookie by calling the /me endpoint
        const response = await axios.get("http://localhost:5001/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data); // If successful, set the user state
      } catch (error) {
        // If it fails (e.g., 401 error), it means no valid cookie, so user stays null
        console.log("No active session found.", error);
      } finally {
        setIsLoading(false); // Stop loading once the check is complete
      }
    };

    checkUserSession();
  }, []);
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

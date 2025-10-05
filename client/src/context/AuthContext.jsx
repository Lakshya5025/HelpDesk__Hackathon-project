import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/me`;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axios.get(`${API_URL}`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.log(error);
        console.log("No active session found.");
      } finally {
        setIsLoading(false);
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

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/logout`;

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const onLogout = async () => {
    try {
      await axios.post(`${API_URL}`, {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">HelpDesk</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>Welcome, {user.name}</li>
            <li>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;

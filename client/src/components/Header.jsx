import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const onLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );
      logout();
      alert("You have been logged out.");
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
              <button className="btn" onClick={onLogout}>
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

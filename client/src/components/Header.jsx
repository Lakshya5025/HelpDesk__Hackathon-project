import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/logout`;

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="bg-gradient-to-r from-slate-800 py-2 via-slate-900 to-slate-800 shadow-xl border-b border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white font-bold text-xl">
            <svg
              className="w-8 h-8 transition-transform duration-300 hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>HelpDesk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md transition-transform duration-300 hover:scale-110">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white">
                    <p className="text-xs text-slate-300">Welcome,</p>
                    <p className="text-sm font-semibold">{user.name}</p>
                  </div>
                </div>

                {user.role === "admin" && (
                  <Link
                    to="/create-agent"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    Create Agent
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 active:bg-slate-500 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-white font-medium hover:bg-slate-700 active:bg-slate-600 rounded-lg transition-all duration-300">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-slate-700 active:bg-slate-600 transition-all duration-300">
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-3 bg-slate-700/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold text-white shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white">
                    <p className="text-xs text-slate-300">Welcome,</p>
                    <p className="text-sm font-semibold">{user.name}</p>
                  </div>
                </div>

                {user.role === "admin" && (
                  <Link
                    to="/create-agent"
                    className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}>
                    Create Agent
                  </Link>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 active:bg-slate-500 transition-all duration-300 shadow-md hover:shadow-lg">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-white font-medium hover:bg-slate-700 active:bg-slate-600 rounded-lg transition-all duration-300 text-center"
                  onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

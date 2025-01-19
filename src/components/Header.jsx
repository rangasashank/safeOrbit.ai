import React from 'react'
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="" // Replace with the path to your logo image
            alt="Logo"
            className="w-12 h-12"
          />
          <h1 className="text-xl font-bold text-gray-700">Disaster Management</h1>
        </div>

        {/* Navbar Links */}
        <nav className="flex space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/report"
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            Report Disaster
          </Link>
          <Link
            to="/alerts"
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            Alerts
          </Link>
          <Link
            to="/chat"
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            Chat
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header
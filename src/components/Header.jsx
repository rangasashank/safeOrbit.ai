import React from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/logo.png'

function Header() {
  return (
      <header className="bg-gray-600 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src={logo} // Replace with the path to your logo image
              alt="Logo"
              className="w-20 h-20"
            />
            
          </div>
  
          {/* Navbar Links */}
          <nav className="flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-white hover:bg-blue-500 hover:scale-110 transition transform px-4 py-2 rounded font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              className="text-white hover:text-white hover:bg-blue-500 hover:scale-110 transition transform px-4 py-2 rounded font-medium"
            >
              Report Disaster
            </Link>
          </nav>
        </div>
      </header>
    );
  }

export default Header
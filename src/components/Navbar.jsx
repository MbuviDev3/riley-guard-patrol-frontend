import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'

function Navbar() {
  const location = useLocation();
  
   const navLinkClass = (path) =>
    `block py-2 px-4 rounded hover:bg-blue-700 ${
      location.pathname === path ? 'bg-blue-700 text-white' : 'text-gray-300'
    }`;

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col justify-between p-4">
      {/* Logo / Title */}
      <div>
        <div className="flex items-center space-x-2 mb-8">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold">Riley Falcon</h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/users" className={navLinkClass('/users')}>
            Users
          </Link>
          <Link to="/checkpoints" className={navLinkClass('/checkpoints')}>
            Checkpoints
          </Link>
          <Link to="/reports" className={navLinkClass('/reports')}>
            Reports
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={() => alert('You will be logged out')}
          className="w-full py-2 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );

}

export default Navbar;

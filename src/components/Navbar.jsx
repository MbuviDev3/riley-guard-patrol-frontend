import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/rileyfalconsecurity_logo.jpeg';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // <--- for redirecting
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = (path) =>
    `block py-2 px-4 rounded hover:bg-blue-700 ${
      location.pathname === path ? 'bg-blue-700 text-white' : 'text-gray-300'
    }`;

  const handleLogout = () => {
    // 1. Clear user session/token
    localStorage.removeItem('user'); // adjust key if different
    sessionStorage.removeItem('token'); // optional if you use token
    // 2. Redirect to login page
    navigate('/login');
  };

  return (
    <div className="bg-blue-900 text-white">
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 lg:hidden">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-lg font-bold">Riley Falcon</h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col justify-between p-4 w-64 h-screen">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-xl font-bold">Riley Falcon</h1>
          </div>

          <nav className="space-y-2">
            <Link to="/supervisor/scancheckpoint" className={navLinkClass('/scancheckpoint')}>
              Scan Checkpoint
            </Link>
            <Link to="/supervisor/dashboard" className={navLinkClass('/Dashboard')}>
              Supervisor Dashboard
            </Link>
            <Link to="/supervisor/assignment" className={navLinkClass('/assignment')}>
              Checkpoint Assignment
            </Link>
            <Link to="/GuardDashboard" className={navLinkClass('/GuarddDashboard')}>
              Guards Dashboard
            </Link>
            <Link to="/users" className={navLinkClass('/users')}>
              View Users
            </Link>
            <Link to="/addcheckpoint" className={navLinkClass('/addcheckpoint')}>
              Addcheckpoint
            </Link>
            <Link to="/reports" className={navLinkClass('/reports')}>
              Reports
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden flex flex-col space-y-2 p-4 bg-blue-800">
          <Link to="/users" className={navLinkClass('/users')} onClick={() => setIsOpen(false)}>
            Users
          </Link>
          <Link
            to="/addcheckpoint"
            className={navLinkClass('/addcheckpoints')}
            onClick={() => setIsOpen(false)}
          >
            Addcheckpoint
          </Link>
          <Link to="/reports" className={navLinkClass('/reports')} onClick={() => setIsOpen(false)}>
            Reports
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;

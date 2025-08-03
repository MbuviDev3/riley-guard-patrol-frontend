import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy auth logic for now
    if (idNumber && password) {
      navigate('/dashboard');
    } else {
      alert('Please enter both ID number and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo or Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">🛡 Riley Falcon</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-1">
              ID Number
            </label>
            <input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your ID number"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

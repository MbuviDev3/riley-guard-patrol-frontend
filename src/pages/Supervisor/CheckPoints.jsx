import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkpoints() {
  const [checkpoints, setCheckpoints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const fetchCheckpoints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/checkpoints');
      setCheckpoints(res.data.checkpoints);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkpoints</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {checkpoints.map(cp => (
            <tr key={cp.id}>
              <td className="border p-2">{cp.name}</td>
              <td className="border p-2">{cp.location}</td>
              <td className="border p-2">
                <button
                  onClick={() => navigate(`/scan`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Scan QR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

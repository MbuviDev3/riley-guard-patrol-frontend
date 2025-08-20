import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

export default function Checkpoints() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const qrRef = useRef();

  // Fetch checkpoints
  const fetchCheckpoints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/checkpoints');
      setCheckpoints(res.data.checkpoints);
    } catch (err) {
      console.error('Error fetching checkpoints:', err);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  // Convert QR to base64
  const generateQRCodeData = () => {
    const canvas = qrRef.current.querySelector('canvas');
    return canvas.toDataURL('image/png'); // Base64 image
  };

  // Add checkpoint
  const handleAddCheckpoint = async (e) => {
    e.preventDefault();

    if (!name || !location) return;

    try {
      const qrCode = generateQRCodeData();
      const res = await axios.post('http://localhost:5000/api/checkpoints', {
        name,
        location,
        qrCode
      });

      setCheckpoints([res.data.checkpoint, ...checkpoints]);
      setName('');
      setLocation('');
    } catch (err) {
      console.error('Error adding checkpoint:', err);
    }
  };

  // Delete checkpoint
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/checkpoints/${id}`);
      setCheckpoints(checkpoints.filter(cp => cp.id !== id));
    } catch (err) {
      console.error('Error deleting checkpoint:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Checkpoints</h2>

      <form onSubmit={handleAddCheckpoint} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Checkpoint Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <div ref={qrRef} className="my-4">
          <QRCodeCanvas value={`${name} - ${location}`} size={128} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Checkpoint
        </button>
      </form>

      <div>
        {checkpoints.map(cp => (
          <div key={cp.id} className="border p-4 mb-4">
            <h3 className="font-bold">{cp.name}</h3>
            <p>{cp.location}</p>
            {cp.qr_code && <img src={cp.qr_code} alt="QR Code" className="w-32 h-32" />}
            <button
              onClick={() => handleDelete(cp.id)}
              className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

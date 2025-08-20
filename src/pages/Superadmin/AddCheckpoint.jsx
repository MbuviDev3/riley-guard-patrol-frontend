import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function AddCheckpoints() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const qrRef = useRef();

  // Fetch checkpoints on page load
  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const fetchCheckpoints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/checkpoints");
       setCheckpoints(res.data.checkpoints || []);
    } catch (error) {
      console.error("Failed to fetch checkpoints:", error);
    }
  };

  const handleAddCheckpoint = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      alert("Please fill all fields");
      return;
    }

    // Generate QR code image as Base64
    const qrCanvas = qrRef.current.querySelector("canvas");
    const qrDataURL = qrCanvas.toDataURL("image/png");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/checkpoints", {
        name,
        location,
        qrCode: qrDataURL, // send base64 image
      });
      alert("Checkpoint added successfully");
      setName("");
      setLocation("");
      fetchCheckpoints();
    } catch (error) {
      console.error("Error adding checkpoint:", error);
      alert("Failed to add checkpoint.");
    }
    setLoading(false);
  };

  const handleDeleteCheckpoint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this checkpoint?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/checkpoints/${id}`);
      alert("Checkpoint deleted");
      fetchCheckpoints();
    } catch (error) {
      console.error("Failed to delete checkpoint:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Checkpoint</h1>
      <form
        onSubmit={handleAddCheckpoint}
        className="flex flex-col gap-4 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Checkpoint Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div ref={qrRef} className="flex justify-center my-2">
          {name && location && (
            <QRCodeCanvas value={`${name}-${location}`} size={128} />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Checkpoint"}
        </button>
      </form>

      {/* Display all checkpoints */}
      <h2 className="text-xl font-semibold mt-6 mb-2">All Checkpoints</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">QR Code</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {checkpoints.map((cp, index) => (
            <tr key={cp.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{cp.name}</td>
              <td className="border p-2">{cp.location}</td>
              <td className="border p-2">
                <img
                  src={cp.qr_code}
                  alt="QR"
                  className="w-16 h-16 mx-auto"
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDeleteCheckpoint(cp.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {checkpoints.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No checkpoints added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

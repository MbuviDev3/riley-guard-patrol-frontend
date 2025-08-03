import React, { useState } from 'react';

function Checkpoints() {
  const [formData, setFormData] = useState({
    userId: '',
    region: '',
    qrCode: '',
    observation: '',
    media: null,
  });

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    filterUserId: '',
  });

  const [checkpoints, setCheckpoints] = useState([]);

  const handleVisitSubmit = (e) => {
    e.preventDefault();

    const newCheckpoint = {
      ...formData,
      date: new Date().toLocaleDateString(),
      mediaAttached: !!formData.media,
    };

    setCheckpoints([...checkpoints, newCheckpoint]);

    setFormData({
      userId: '',
      region: '',
      qrCode: '',
      observation: '',
      media: null,
    });
  };

  const filteredCheckpoints = checkpoints.filter((cp) => {
    const matchesUserId = filters.filterUserId ? cp.userId === filters.filterUserId : true;
    const matchesFromDate = filters.fromDate ? new Date(cp.date) >= new Date(filters.fromDate) : true;
    const matchesToDate = filters.toDate ? new Date(cp.date) <= new Date(filters.toDate) : true;
    return matchesUserId && matchesFromDate && matchesToDate;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-2xl font-bold text-blue-800">New Check Point Visit</h2>

      {/* New Visit Form */}
      <form onSubmit={handleVisitSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          placeholder="User ID"
          className="border px-3 py-2 rounded"
          required
        />
        <select
          name="region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        >
          <option value="">Choose Region</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Kisumu">Kisumu</option>
        </select>
        <input
          type="text"
          name="qrCode"
          value={formData.qrCode}
          onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
          placeholder="Scan QR Code"
          className="border px-3 py-2 rounded"
          required
        />
        <textarea
          name="observation"
          value={formData.observation}
          onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
          placeholder="On-Site Observation"
          className="border px-3 py-2 rounded col-span-2"
        ></textarea>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFormData({ ...formData, media: e.target.files[0] })}
          className="col-span-2"
        />
        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
            Submit Visit
          </button>
        </div>
      </form>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-blue-800">Filter Check Point Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="User ID"
            value={filters.filterUserId}
            onChange={(e) => setFilters({ ...filters, filterUserId: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Filter</button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">
            {filteredCheckpoints.length} Results Found
          </p>
          <div className="space-x-2">
            <button className="bg-yellow-500 px-3 py-1 rounded text-white">Export to Excel</button>
            <button className="bg-blue-800 px-3 py-1 rounded text-white">Print</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-2 px-3">User ID</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3">Observation</th>
                <th className="py-2 px-3">QR Code</th>
                <th className="py-2 px-3">Photo/Video</th>
                <th className="py-2 px-3">Date Visited</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckpoints.map((cp, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{cp.userId}</td>
                  <td className="py-2 px-3">{cp.region}</td>
                  <td className="py-2 px-3">{cp.observation}</td>
                  <td className="py-2 px-3">{cp.qrCode}</td>
                  <td className="py-2 px-3">{cp.mediaAttached ? '(Attached)' : 'None'}</td>
                  <td className="py-2 px-3">{cp.date}</td>
                </tr>
              ))}
              {filteredCheckpoints.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Checkpoints;

import React, { useState } from 'react';

const Reports = () => {
  const [report, setReport] = useState({
    userId: '',
    reportType: '',
    notes: '',
    photo: null,
  });

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    userId: '',
    reportType: '',
  });

  const [reports, setReports] = useState([]);

  const handleReportSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      ...report,
      photoName: report.photo ? report.photo.name : 'None',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    setReports([...reports, newReport]);

    // Reset form
    setReport({
      userId: '',
      reportType: '',
      notes: '',
      photo: null,
    });
  };

  const filteredReports = reports.filter((r) => {
    const matchUserId = filters.userId ? r.userId.includes(filters.userId) : true;
    const matchType = filters.reportType ? r.reportType.includes(filters.reportType) : true;
    const matchFrom = filters.fromDate ? new Date(r.date) >= new Date(filters.fromDate) : true;
    const matchTo = filters.toDate ? new Date(r.date) <= new Date(filters.toDate) : true;
    return matchUserId && matchType && matchFrom && matchTo;
  });

  return (
    <div className="space-y-8 p-6">
      {/* New Report */}
      <div>
        <h2 className="text-xl font-bold mb-4">New Report</h2>
        <form onSubmit={handleReportSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="User ID"
            value={report.userId}
            onChange={(e) => setReport({ ...report, userId: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <select
            value={report.reportType}
            onChange={(e) => setReport({ ...report, reportType: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Report Type</option>
            <option value="Incident Report">Incident Report</option>
            <option value="Normal Report">Normal Report</option>
          </select>

          <textarea
            placeholder="Notes"
            value={report.notes}
            onChange={(e) => setReport({ ...report, notes: e.target.value })}
            className="border p-2 rounded col-span-1 md:col-span-2"
            required
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setReport({ ...report, photo: e.target.files[0] })}
            className="col-span-1 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Submit Report
          </button>
        </form>
      </div>

      {/* Filter Reports */}
      <div>
        <h2 className="text-xl font-bold mb-4">Filter Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Report Type"
            value={filters.reportType}
            onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={() => {}}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Display Reports */}
      <div>
        <h2 className="text-xl font-bold mb-4">Filtered Reports</h2>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Photo</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((r, index) => (
                <tr key={index}>
                  <td className="p-2 border">{r.userId}</td>
                  <td className="p-2 border">{r.reportType}</td>
                  <td className="p-2 border">{r.notes}</td>
                  <td className="p-2 border">{r.photoName}</td>
                  <td className="p-2 border">{r.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

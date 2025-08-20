import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const [report, setReport] = useState({
    userId: '',
    reportType: '',
    notes: '',
    photo: null,
  });
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    userId: '',
    reportType: '',
  });

  // Fetch all reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', report.userId);
    formData.append('reportType', report.reportType);
    formData.append('notes', report.notes);
    if (report.photo) formData.append('photo', report.photo);

    try {
      await axios.post('http://localhost:5000/api/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchReports(); // refresh table
      setReport({ userId: '', reportType: '', notes: '', photo: null });
    } catch (err) {
      console.error('Failed to submit report:', err);
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const matchUserId = filters.userId ? r.user_id.includes(filters.userId) : true;
    const matchType = filters.reportType ? r.report_type.includes(filters.reportType) : true;
    const matchFrom = filters.fromDate ? new Date(r.created_at) >= new Date(filters.fromDate) : true;
    const matchTo = filters.toDate ? new Date(r.created_at) <= new Date(filters.toDate) : true;
    return matchUserId && matchType && matchFrom && matchTo;
  });

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Reports', 14, 16);

    const tableRows = filteredReports.map((r) => [
      r.user_id,
      r.report_type,
      r.notes,
      r.photo_name || 'None',
      new Date(r.created_at).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['User ID', 'Type', 'Notes', 'Photo', 'Date']],
      body: tableRows,
      styles: { cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save('reports.pdf');
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* New Report Form */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">New Report</h2>
        <form onSubmit={handleReportSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="User ID"
            value={report.userId}
            onChange={(e) => setReport({ ...report, userId: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={report.reportType}
            onChange={(e) => setReport({ ...report, reportType: e.target.value })}
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded col-span-1 sm:col-span-2 w-full"
            required
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setReport({ ...report, photo: e.target.files[0] })}
            className="col-span-1 sm:col-span-2"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 col-span-1 sm:col-span-2"
          >
            Submit Report
          </button>
        </form>
      </div>

      {/* Filters + Export PDF */}
      <div className="bg-white shadow-md p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Report Type"
          value={filters.reportType}
          onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={exportPDF}
          className="mt-2 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export PDF
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow-md p-4 rounded-lg overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Reports</h2>
        <table className="w-full border text-sm sm:text-base">
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
              filteredReports.map((r) => (
                <tr key={r.id}>
                  <td className="p-2 border">{r.user_id}</td>
                  <td className="p-2 border">{r.report_type}</td>
                  <td className="p-2 border">{r.notes}</td>
                  <td className="p-2 border">{r.photo_url ? (
                    <img
                      src={`http://localhost:5000${r.photo_url}`}
                      alt="Report"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    'No Image'
                  )}</td>
                  <td className="p-2 border">{new Date(r.created_at).toLocaleString()}</td>
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
}

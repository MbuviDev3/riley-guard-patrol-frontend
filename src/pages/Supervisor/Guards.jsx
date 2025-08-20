import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ side-effect import, DO NOT destructure

export default function Guards() {
  const [guards, setGuards] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments/');
      setGuards(res.data.guards);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter guards by name
  const filteredGuards = guards.filter(g =>
    `${g.first_name} ${g.second_name}`.toLowerCase().includes(filterText.toLowerCase())
  );

  // Export to PDF
    const exportPDF = () => {
  const doc = new jsPDF();

  const tableBody = [];
  filteredGuards.forEach(g => {
    if (g.assigned_checkpoints && g.assigned_checkpoints.length > 0) {
      g.assigned_checkpoints.forEach(c => {
        tableBody.push([
          `${g.first_name} ${g.second_name}`,
          c.name,
          new Date(c.assigned_at).toLocaleString()
        ]);
      });
    } else {
      tableBody.push([`${g.first_name} ${g.second_name}`, 'None', 'None']);
    }
  });

  doc.text('Guards Report', 14, 16);

  // ✅ Call autoTable directly
  autoTable(doc, {
    startY: 20,
    head: [['Name', 'Assigned Checkpoint', 'Timestamp']],
    body: tableBody,
    styles: { cellWidth: 'wrap' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });

  doc.save('guards_report.pdf');
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Guards</h1>

      {/* Filter and Export */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Assigned Checkpoint</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredGuards.map(g => {
            if (g.assigned_checkpoints && g.assigned_checkpoints.length > 0) {
              return g.assigned_checkpoints.map(c => (
                <tr key={`${g.id}-${c.id}`}>
                  <td className="border p-2">{g.first_name} {g.second_name}</td>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{new Date(c.assigned_at).toLocaleString()}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={g.id}>
                  <td className="border p-2">{g.first_name} {g.second_name}</td>
                  <td className="border p-2">None</td>
                  <td className="border p-2">None</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

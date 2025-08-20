import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function AssignCheckpoints() {
  const [guards, setGuards] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedGuard, setSelectedGuard] = useState("");
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [filterGuard, setFilterGuard] = useState("");
  const [filterCheckpoint, setFilterCheckpoint] = useState("");

  useEffect(() => {
    fetchGuards();
    fetchCheckpoints();
    fetchAssignments();
  }, []);

  const fetchGuards = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/guards");
      setGuards(res.data.guards);
    } catch (err) {
      console.error("Failed to fetch guards:", err);
    }
  };

  const fetchCheckpoints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/checkpoints");
      setCheckpoints(res.data.checkpoints);
    } catch (err) {
      console.error("Failed to fetch checkpoints:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedGuard) return alert("Please select a guard!");
    if (!selectedCheckpoint) return alert("Please select a checkpoint!");

    try {
      await axios.post("http://localhost:5000/api/assignments", {
        guardId: selectedGuard,
        checkpointId: selectedCheckpoint,
      });
      alert("Checkpoint assigned successfully!");
      setSelectedGuard("");
      setSelectedCheckpoint("");
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert("Failed to assign checkpoint");
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    return (
      (filterGuard ? a.first_name.toLowerCase().includes(filterGuard.toLowerCase()) : true) &&
      (filterCheckpoint ? a.checkpoint_name.toLowerCase().includes(filterCheckpoint.toLowerCase()) : true)
    );
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Assignments Report", 14, 20);
    doc.setFontSize(12);

    let y = 30;
    // Table header
    doc.text("Guard", 14, y);
    doc.text("Checkpoint", 60, y);
    doc.text("Location", 120, y);
    doc.text("Assigned At", 170, y);
    y += 6;

    filteredAssignments.forEach((a) => {
      doc.text(`${a.first_name} ${a.second_name}`, 14, y);
      doc.text(a.checkpoint_name, 60, y);
      doc.text(a.location, 120, y);
      doc.text(new Date(a.assigned_at).toLocaleString(), 170, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("assignments_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Checkpoints</h1>

      <div className="flex flex-col gap-4 max-w-md mb-6">
        <select
          value={selectedGuard}
          onChange={(e) => setSelectedGuard(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Guard</option>
          {guards.map((g) => (
            <option key={g.id} value={g.id}>
              {g.first_name} {g.second_name}
            </option>
          ))}
        </select>

        <select
          value={selectedCheckpoint}
          onChange={(e) => setSelectedCheckpoint(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Checkpoint</option>
          {checkpoints.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Assign
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 max-w-md">
        <input
          type="text"
          placeholder="Filter by guard"
          value={filterGuard}
          onChange={(e) => setFilterGuard(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Filter by checkpoint"
          value={filterCheckpoint}
          onChange={(e) => setFilterCheckpoint(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Guard</th>
              <th className="p-2 border">Checkpoint</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Assigned At</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-500">
                  No assignments yet
                </td>
              </tr>
            ) : (
              filteredAssignments.map((a) => (
                <tr key={a.assignment_id}>
                  <td className="p-2 border">{a.first_name} {a.second_name}</td>
                  <td className="p-2 border">{a.checkpoint_name}</td>
                  <td className="p-2 border">{a.location}</td>
                  <td className="p-2 border">{new Date(a.assigned_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

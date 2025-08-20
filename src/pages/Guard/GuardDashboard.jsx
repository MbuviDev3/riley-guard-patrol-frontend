import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GuardDashboard({ guardId }) {
  const [assignments, setAssignments] = useState([]);

useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignments/guard/${guardId}`
      );
      setAssignments(res.data.assignments || []); // fallback to empty array
    } catch (err) {
      console.error('Failed to fetch assignments', err);
      setAssignments([]); // ensure safe fallback
    }
  };
  if (guardId) fetchAssignments();
}, [guardId]);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-3">My Assigned Checkpoints</h2>
      {assignments.length === 0 ? (
        <p>No checkpoints assigned yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {assignments.map(a => (
            <li key={a.assignment_id}>
              {a.name} - {a.location} (Assigned: {new Date(a.assigned_at).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

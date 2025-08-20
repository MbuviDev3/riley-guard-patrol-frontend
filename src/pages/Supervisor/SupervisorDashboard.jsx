import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SupervisorDashboard() {
  const [guardsCount, setGuardsCount] = useState(0);
  const [checkpointsCount, setCheckpointsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const guardsRes = await axios.get('http://localhost:5000/api/users/guards');
      setGuardsCount(guardsRes.data.guards.length);

      const checkpointsRes = await axios.get('http://localhost:5000/api/checkpoints');
      setCheckpointsCount(checkpointsRes.data.checkpoints.length);

      const reportsRes = await axios.get('http://localhost:5000/api/reports');
      setReportsCount(reportsRes.data.reports.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supervisor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Guards</h2>
          <p className="text-xl">{guardsCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Checkpoints</h2>
          <p className="text-xl">{checkpointsCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Reports Today</h2>
          <p className="text-xl">{reportsCount}</p>
        </div>
      </div>
    </div>
  );
}

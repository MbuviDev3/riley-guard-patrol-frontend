import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Side-effect import

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users"); // backend endpoint
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by name or user ID
  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.second_name}`
      .toLowerCase()
      .includes(filterText.toLowerCase()) ||
    (u.user_id && u.user_id.toLowerCase().includes(filterText.toLowerCase()))
  );

  // Export filtered users to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users List", 14, 16);

    const tableRows = filteredUsers.map((u) => [
      u.user_id,
      `${u.first_name} ${u.second_name}`,
      u.phone,
      u.role,
      u.gender || "N/A",
      u.branch || "N/A",
      new Date(u.created_at).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["User ID", "Name", "Phone", "Role", "Gender", "Branch", "Added"]],
      body: tableRows,
      styles: { cellWidth: "wrap" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("users_list.pdf");
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading users...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Users List</h2>

      {/* Filter and Export */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Filter by name or user ID..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users available.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.user_id}</td>
                  <td className="p-3">{u.first_name} {u.second_name}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u.gender || "N/A"}</td>
                  <td className="p-3">{u.branch || "N/A"}</td>
                  <td className="p-3">{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

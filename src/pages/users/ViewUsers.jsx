import React from 'react';

const ViewUsers = ({ users, onDelete }) => {
  return (
    <div className="p-6 bg-white rounded shadow max-w-5xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">View Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users added yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2">User ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Role</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="text-sm border-t">
                <td className="p-2">{u.userId}</td>
                <td className="p-2">{u.firstName} {u.secondName}</td>
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.gender}</td>
                <td className="p-2">
                  <button onClick={() => onDelete(i)} className="bg-red-600 px-3 py-1 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewUsers;

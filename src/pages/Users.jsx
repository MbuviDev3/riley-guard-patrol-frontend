import React, { useState, useEffect } from 'react';

function Users() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    userId: '',
    phone: '',
    email: '',
    role: '',
    branch: '',
    gender: '',
  });

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real app, you'd send data to backend here
    setUsers([...users, formData]); // Add to list
    setFormData({  // Reset form
      firstName: '',
      secondName: '',
      userId: '',
      phone: '',
      email: '',
      role: '',
      branch: '',
      gender: '',
    });
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Add New User</h2>
      
      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border px-3 py-2 rounded" required />
        <input type="text" name="secondName" value={formData.secondName} onChange={handleChange} placeholder="Second Name" className="border px-3 py-2 rounded" required />
        <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="User ID" className="border px-3 py-2 rounded" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="border px-3 py-2 rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="border px-3 py-2 rounded" required>
          <option value="">-- Select Role --</option>
          <option value="guard">Guard</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
        <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" className="border px-3 py-2 rounded" />
        <div className="flex gap-4 items-center">
          <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Male</label>
          <label><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female</label>
        </div>
        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">Add New User</button>
        </div>
      </form>

      {/* VIEW USERS */}
      <h2 className="text-xl font-bold mt-10 mb-4">View Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users added yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Gender</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{u.userId}</td>
                  <td className="py-2 px-4">{u.firstName} {u.secondName}</td>
                  <td className="py-2 px-4">{u.phone}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4">{u.gender}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;

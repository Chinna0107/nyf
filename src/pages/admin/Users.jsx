import React, { useState } from 'react';
import config from '../../config';
import { useFetch } from '../../hooks/useFetch';

const API_BASE_URL = config.apiUrl;

const Users = () => {
  const { data: users = [], loading, refetch } = useFetch('/admin/users', { auth: true });
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const toggleAdmin = async (id, current) => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_admin: !current })
    });
    if (res.ok) {
      setMessage(`User ${!current ? 'promoted to admin' : 'demoted to user'}`);
      refetch();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage('User deleted');
      refetch();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Manage Users</h1>

        {message && <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded mb-4">{message}</div>}

        <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm mb-5 focus:outline-none focus:border-white placeholder-gray-500" />

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">No users found</div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Role</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}`}>
                    <td className="px-4 py-3 text-white font-medium">{u.first_name} {u.last_name}</td>
                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.is_admin ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'}`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => toggleAdmin(u.id, u.is_admin)}
                        className="px-3 py-1 border border-gray-600 text-white rounded text-xs hover:border-white transition-colors">
                        {u.is_admin ? 'Demote' : 'Make Admin'}
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="px-3 py-1 bg-red-700 text-white rounded text-xs hover:bg-red-600 transition-colors">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

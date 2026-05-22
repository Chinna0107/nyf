import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const Banners = () => {
  const { data: banners = [], loading, refetch } = useFetch('/admin/banners', { auth: true });
  const [message, setMessage] = useState('');

  const deleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage('Banner deleted');
      refetch();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Banners</h1>
          <Link to="/admin/banners/add">
            <button className="px-5 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors">➕ Add Banner</button>
          </Link>
        </div>

        {message && <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded mb-4">{message}</div>}

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : banners.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
            No banners yet. <Link to="/admin/banners/add" className="text-white underline">Add one</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(banner => (
              <div key={banner.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                <img src={banner.image_url} alt={banner.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{banner.title}</h3>
                  {banner.link && <p className="text-xs text-gray-500 mb-3 truncate">{banner.link}</p>}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${banner.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/admin/banners/edit/${banner.id}`} className="flex-1">
                      <button className="w-full py-2 bg-white text-black rounded-lg text-sm hover:bg-gray-200 transition-colors">✏️ Edit</button>
                    </Link>
                    <button onClick={() => deleteBanner(banner.id)} className="flex-1 py-2 bg-red-700 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;

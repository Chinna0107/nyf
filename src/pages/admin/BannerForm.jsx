import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ title: '', image_url: '', link: '', active: true });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage('');
    
    const token = localStorage.getItem('authToken');
    const data = new FormData();
    data.append("image", file); // Consistent with ProductForm 'image' field

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, image_url: result.url }));
      } else {
        setMessage("Image upload failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      setMessage("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('authToken');
      fetch(`${API_BASE_URL}/admin/banners/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).then(data => {
        setFormData({ title: data.title, image_url: data.image_url, link: data.link || '', active: data.active });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const token = localStorage.getItem('authToken');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/admin/banners/${id}` : `${API_BASE_URL}/admin/banners`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage(id ? 'Banner updated!' : 'Banner created!');
        setTimeout(() => navigate('/admin/banners'), 1200);
      } else {
        const err = await res.json();
        setMessage(err.message || 'Error saving banner');
      }
    } catch {
      setMessage('Error saving banner');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-400">Loading...</p>;

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{id ? 'Edit Banner' : 'Add Banner'}</h1>

        {message && (
          <div className={`px-4 py-3 rounded mb-4 border ${message.includes('Error') ? 'bg-red-900 border-red-700 text-red-300' : 'bg-green-900 border-green-700 text-green-300'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-white placeholder-gray-600" placeholder="Banner title" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Image</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage}
                className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-white placeholder-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700" />
              {uploadingImage && <span className="text-sm text-gray-400 whitespace-nowrap">Uploading...</span>}
            </div>
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-3 w-full max-h-48 object-cover rounded-lg" />}
            <input type="hidden" name="image_url" value={formData.image_url} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Link (optional)</label>
            <input type="text" name="link" value={formData.link} onChange={handleChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-white placeholder-gray-600" placeholder="/products" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 accent-white" />
            <label htmlFor="active" className="text-sm font-semibold text-gray-300">Active</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting}
              className="flex-1 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Banner'}
            </button>
            <button type="button" onClick={() => navigate('/admin/banners')}
              className="flex-1 py-2 border border-gray-700 text-white rounded-lg font-semibold hover:border-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;

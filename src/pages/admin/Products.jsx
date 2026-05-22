import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import config from '../../config';
import './admin.css';
import { formatCurrency } from './adminUtils';
import { getProductImage } from '../../utils/productImages';

const API_BASE_URL = config.apiUrl;

const Products = () => {
  const { data: products = [], loading, refetch } = useFetch('/admin/products', { auth: true });
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMessage('Product deleted.');
      refetch();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const categories = useMemo(() => {
    const values = products.map((product) => product.category).filter(Boolean);
    return ['all', ...Array.from(new Set(values))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !q || [product.name, product.category, product.description]
        .some((value) => String(value || '').toLowerCase().includes(q));
      const matchesCategory = category === 'all' || product.category === category;
      const matchesStatus = status === 'all' || (status === 'active' ? product.active : !product.active);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const totalInventory = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 5).length;
  const activeProducts = products.filter((product) => product.active).length;

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Catalog studio</p>
            <h1 className="admin-title">Products</h1>
            <p className="admin-subtitle">Manage product visibility, inventory, categories, pricing, color imagery, and edit flow.</p>
          </div>
          <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
            <FaPlus /> Add Product
          </Link>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Products</p>
            <p className="admin-stat-value">{products.length}</p>
          </div>
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Active</p>
            <p className="admin-stat-value">{activeProducts}</p>
          </div>
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Inventory Units</p>
            <p className="admin-stat-value">{totalInventory}</p>
          </div>
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Low Stock</p>
            <p className="admin-stat-value">{lowStock}</p>
          </div>
        </div>

        {message && <div className="admin-card" style={{ marginTop: 16, color: '#86efac' }}>{message}</div>}

        <div className="admin-toolbar">
          <label style={{ position: 'relative' }}>
            <FaSearch style={{ color: '#777', left: 14, position: 'absolute', top: 13 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="admin-search"
              style={{ paddingLeft: 40 }}
            />
          </label>
          <div className="admin-actions">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="admin-search" style={{ minWidth: 170 }}>
              {categories.map((item) => (
                <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-search" style={{ minWidth: 150 }}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-panel admin-empty">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-panel admin-empty">No products found.</div>
        ) : (
          <div className="admin-panel admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sizes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const image = getProductImage(product);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {image && (
                            <img
                              src={image}
                              alt={product.name}
                              className="admin-order-image"
                              onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <div>
                            <div className="admin-strong">{product.name}</div>
                            <div className="admin-muted">{(product.description || '').slice(0, 70)}{product.description?.length > 70 ? '...' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-strong">{formatCurrency(product.price)}</div>
                        {product.original_price && <div className="admin-muted">MRP {formatCurrency(product.original_price)}</div>}
                      </td>
                      <td className="admin-muted">{product.category || 'Not set'}</td>
                      <td>
                        <span className={`admin-badge ${Number(product.stock || 0) <= 5 ? 'admin-badge-red' : 'admin-badge-green'}`}>
                          {product.stock || 0} units
                        </span>
                      </td>
                      <td className="admin-muted">{Array.isArray(product.sizes) && product.sizes.length ? product.sizes.join(', ') : 'All'}</td>
                      <td>
                        <span className={`admin-badge ${product.active ? 'admin-badge-green' : 'admin-badge-red'}`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/products/edit/${product.id}`} className="admin-btn admin-btn-secondary">
                            <FaEdit /> Edit
                          </Link>
                          <button onClick={() => deleteProduct(product.id)} className="admin-btn admin-btn-danger">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

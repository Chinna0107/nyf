import React, { useMemo, useState } from 'react';
import { FaSearch, FaWhatsapp } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import './admin.css';
import { buildCustomerStats, formatCurrency, formatDate, normalizePhone } from './adminUtils';

const Customers = () => {
  const { data: users = [], loading: usersLoading } = useFetch('/admin/users', { auth: true });
  const { data: orders = [], loading: ordersLoading } = useFetch('/orders/admin', { auth: true });
  const [search, setSearch] = useState('');

  const customers = useMemo(() => buildCustomerStats(users, orders), [users, orders]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone].some((value) => String(value || '').toLowerCase().includes(q))
    );
  }, [customers, search]);

  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);
  const repeatCustomers = customers.filter((customer) => customer.orders > 1).length;
  const loading = usersLoading || ordersLoading;

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Customer ledger</p>
            <h1 className="admin-title">Customers</h1>
            <p className="admin-subtitle">View customer name, joined date, order count, lifetime spend, contact details, and most recent activity.</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Customers</p>
            <p className="admin-stat-value">{customers.length}</p>
          </div>
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Lifetime Spend</p>
            <p className="admin-stat-value">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="admin-card admin-stat">
            <p className="admin-stat-label">Repeat Customers</p>
            <p className="admin-stat-value">{repeatCustomers}</p>
          </div>
        </div>

        <div className="admin-toolbar">
          <label style={{ position: 'relative' }}>
            <FaSearch style={{ color: '#777', left: 14, position: 'absolute', top: 13 }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="admin-search"
              style={{ paddingLeft: 40 }}
            />
          </label>
        </div>

        {loading ? (
          <div className="admin-panel admin-empty">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-panel admin-empty">No customers found.</div>
        ) : (
          <div className="admin-panel admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Date Joined</th>
                  <th>Spent For Us</th>
                  <th>Orders</th>
                  <th>Last Order</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const phone = normalizePhone(customer.phone);
                  const url = phone
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${customer.name}, thanks for choosing us.`)}`
                    : '';
                  return (
                    <tr key={customer.id}>
                      <td>
                        <div className="admin-strong">{customer.name}</div>
                        <div className="admin-muted">{customer.email}</div>
                      </td>
                      <td>{formatDate(customer.joined)}</td>
                      <td className="admin-strong">{formatCurrency(customer.spent)}</td>
                      <td><span className="admin-badge admin-badge-blue">{customer.orders}</span></td>
                      <td>{formatDate(customer.lastOrder)}</td>
                      <td>
                        <div className="admin-muted" style={{ marginBottom: 8 }}>{customer.phone || 'No phone'}</div>
                        <a
                          className="admin-btn admin-btn-whatsapp"
                          href={url || undefined}
                          target="_blank"
                          rel="noreferrer"
                          aria-disabled={!url}
                          onClick={(event) => {
                            if (!url) event.preventDefault();
                          }}
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
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

export default Customers;

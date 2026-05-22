import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaChartLine, FaClipboardList, FaPlus, FaRupeeSign, FaUsers, FaWhatsapp } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import './admin.css';
import { buildWhatsAppOrderUrl, formatCurrency, formatDate, getCustomerEmail, getCustomerName, getCustomerPhone } from './adminUtils';

const RecentOrderCard = ({ order }) => {
  const whatsAppUrl = buildWhatsAppOrderUrl(order);

  return (
    <div className="admin-card">
      <div className="admin-actions" style={{ justifyContent: 'space-between' }}>
        <span className="admin-strong">#{order.id}</span>
        <span className="admin-badge admin-badge-yellow">{order.status || 'pending'}</span>
      </div>
      <p className="admin-strong" style={{ marginTop: 18 }}>{getCustomerName(order)}</p>
      <p className="admin-muted">{formatDate(order.created_at)}</p>
      <p className="admin-stat-value" style={{ fontSize: 24 }}>{formatCurrency(order.total)}</p>
      <a
        className="admin-btn admin-btn-whatsapp"
        href={whatsAppUrl || undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => {
          if (!whatsAppUrl) event.preventDefault();
        }}
      >
        <FaWhatsapp /> Notify via WhatsApp
      </a>
    </div>
  );
};

const Dashboard = () => {
  const { data, loading: statsLoading } = useFetch('/admin/dashboard', { auth: true });
  const { data: orders = [], loading: ordersLoading } = useFetch('/orders/admin', { auth: true });
  const stats = data || { users: 0, products: 0, banners: 0, orders: 0, revenue: 0 };
  const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentOrders = sortedOrders.slice(0, 6);

  const cards = [
    { title: 'Revenue', value: formatCurrency(stats.revenue), icon: <FaRupeeSign />, link: '/admin/reports' },
    { title: 'Total Orders', value: stats.orders || orders.length, icon: <FaClipboardList />, link: '/admin/orders' },
    { title: 'Customers', value: stats.users, icon: <FaUsers />, link: '/admin/customers' },
    { title: 'Products', value: stats.products, icon: <FaBoxOpen />, link: '/admin/products' },
    { title: 'Banners', value: stats.banners, icon: <FaChartLine />, link: '/admin/banners' },
  ];

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Control center</p>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Track revenue, monitor every order, and contact customers from one premium workspace.</p>
          </div>
          <div className="admin-actions">
            <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
              <FaPlus /> Add Product
            </Link>
            <Link to="/admin/reports" className="admin-btn admin-btn-secondary">
              <FaChartLine /> Reports
            </Link>
          </div>
        </div>

        {statsLoading ? (
          <div className="admin-empty admin-panel">Loading dashboard...</div>
        ) : (
          <div className="admin-stat-grid">
            {cards.map((card) => (
              <Link key={card.title} to={card.link} className="admin-card admin-stat">
                <span className="admin-stat-icon">{card.icon}</span>
                <span>
                  <p className="admin-stat-label">{card.title}</p>
                  <p className="admin-stat-value">{card.value}</p>
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="admin-toolbar" style={{ marginTop: 26 }}>
          <div>
            <h2 className="admin-strong" style={{ fontSize: 22 }}>All Orders</h2>
            <p className="admin-muted">Complete order list with customer WhatsApp notification.</p>
          </div>
          <Link to="/admin/orders" className="admin-btn admin-btn-secondary">Open Orders Page</Link>
        </div>

        <div className="admin-panel admin-table-wrap">
          {ordersLoading ? (
            <div className="admin-empty">Loading orders...</div>
          ) : sortedOrders.length === 0 ? (
            <div className="admin-empty">No orders found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Notify</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => {
                  const whatsAppUrl = buildWhatsAppOrderUrl(order);
                  return (
                    <tr key={order.id}>
                      <td className="admin-strong">#{order.id}</td>
                      <td>
                        <div className="admin-strong">{getCustomerName(order)}</div>
                        <div className="admin-muted">{getCustomerEmail(order)}</div>
                        <div className="admin-muted">{getCustomerPhone(order) || 'No phone'}</div>
                      </td>
                      <td className="admin-strong">{formatCurrency(order.total)}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td><span className="admin-badge admin-badge-blue">{order.status || 'pending'}</span></td>
                      <td>
                        <a
                          className="admin-btn admin-btn-whatsapp"
                          href={whatsAppUrl || undefined}
                          target="_blank"
                          rel="noreferrer"
                          aria-disabled={!whatsAppUrl}
                          onClick={(event) => {
                            if (!whatsAppUrl) event.preventDefault();
                          }}
                        >
                          <FaWhatsapp /> Notify
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-toolbar" style={{ marginTop: 26 }}>
          <div>
            <h2 className="admin-strong" style={{ fontSize: 22 }}>Recent Orders</h2>
            <p className="admin-muted">Fresh activity for fast fulfillment decisions.</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          {recentOrders.map((order) => (
            <RecentOrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

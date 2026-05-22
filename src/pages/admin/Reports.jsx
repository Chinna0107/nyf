import React, { useMemo } from 'react';
import { FaDownload, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import './admin.css';
import { buildCustomerStats, formatCurrency, formatDate, getCustomerName, parseOrderItems } from './adminUtils';

const exportWord = () => {
  const report = document.querySelector('.admin-report-print');
  if (!report) return;

  const html = `
    <html>
      <head><meta charset="utf-8"><title>Meda Admin Report</title></head>
      <body>${report.innerHTML}</body>
    </html>
  `;
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `meda-admin-report-${new Date().toISOString().slice(0, 10)}.doc`;
  link.click();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const { data: orders = [], loading: ordersLoading } = useFetch('/orders/admin', { auth: true });
  const { data: users = [], loading: usersLoading } = useFetch('/admin/users', { auth: true });
  const { data: products = [], loading: productsLoading } = useFetch('/admin/products', { auth: true });
  const loading = ordersLoading || usersLoading || productsLoading;

  const report = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const customers = buildCustomerStats(users, orders);
    const avgOrder = orders.length ? revenue / orders.length : 0;
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const categoryRevenue = orders.reduce((acc, order) => {
      const items = parseOrderItems(order.items);
      items.forEach((item) => {
        const key = item.category || 'Uncategorized';
        acc[key] = (acc[key] || 0) + Number(item.price || 0) * Number(item.quantity || 1);
      });
      return acc;
    }, {});

    return {
      revenue,
      avgOrder,
      customers,
      statusCounts,
      categoryRevenue,
      topCustomers: customers.slice(0, 5),
      recentOrders: [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
    };
  }, [orders, users]);

  const maxStatus = Math.max(1, ...Object.values(report.statusCounts));
  const maxCategory = Math.max(1, ...Object.values(report.categoryRevenue));

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-page-header admin-no-print">
          <div>
            <p className="admin-eyebrow">Business intelligence</p>
            <h1 className="admin-title">Reports</h1>
            <p className="admin-subtitle">A clean snapshot of revenue, orders, customer value, product readiness, and fulfillment movement.</p>
          </div>
          <div className="admin-actions">
            <button onClick={() => window.print()} className="admin-btn admin-btn-primary">
              <FaFilePdf /> Export PDF
            </button>
            <button onClick={exportWord} className="admin-btn admin-btn-secondary">
              <FaFileWord /> Export Word
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-panel admin-empty">Loading report...</div>
        ) : (
          <div className="admin-report-print">
            <div className="admin-toolbar">
              <div>
                <p className="admin-eyebrow">Meda report</p>
                <h2 className="admin-title" style={{ fontSize: 30 }}>Performance Summary</h2>
                <p className="admin-muted">Generated {formatDate(new Date())}</p>
              </div>
              <FaDownload className="admin-no-print" style={{ color: '#d4af37', fontSize: 24 }} />
            </div>

            <div className="admin-kpi-row">
              <div className="admin-card admin-stat">
                <p className="admin-stat-label">Revenue</p>
                <p className="admin-stat-value">{formatCurrency(report.revenue)}</p>
              </div>
              <div className="admin-card admin-stat">
                <p className="admin-stat-label">Orders</p>
                <p className="admin-stat-value">{orders.length}</p>
              </div>
              <div className="admin-card admin-stat">
                <p className="admin-stat-label">Average Order</p>
                <p className="admin-stat-value">{formatCurrency(report.avgOrder)}</p>
              </div>
              <div className="admin-card admin-stat">
                <p className="admin-stat-label">Products</p>
                <p className="admin-stat-value">{products.length}</p>
              </div>
            </div>

            <div className="admin-chart-row">
              <div className="admin-card">
                <h3 className="admin-strong">Order Status</h3>
                {Object.entries(report.statusCounts).map(([status, count]) => (
                  <div className="admin-bar" key={status}>
                    <span className="admin-muted" style={{ textTransform: 'capitalize' }}>{status}</span>
                    <span className="admin-bar-track"><span className="admin-bar-fill" style={{ width: `${(count / maxStatus) * 100}%` }} /></span>
                    <span className="admin-strong">{count}</span>
                  </div>
                ))}
              </div>
              <div className="admin-card">
                <h3 className="admin-strong">Top Customers</h3>
                {report.topCustomers.map((customer) => (
                  <div key={customer.id} className="admin-toolbar" style={{ margin: '13px 0 0' }}>
                    <span>
                      <span className="admin-strong">{customer.name}</span>
                      <span className="admin-muted" style={{ display: 'block' }}>{customer.orders} orders</span>
                    </span>
                    <span className="admin-strong">{formatCurrency(customer.spent)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-chart-row" style={{ marginTop: 14 }}>
              <div className="admin-card">
                <h3 className="admin-strong">Category Revenue</h3>
                {Object.entries(report.categoryRevenue).length === 0 ? (
                  <p className="admin-muted" style={{ marginTop: 12 }}>No category revenue available yet.</p>
                ) : (
                  Object.entries(report.categoryRevenue).map(([category, amount]) => (
                    <div className="admin-bar" key={category}>
                      <span className="admin-muted">{category}</span>
                      <span className="admin-bar-track"><span className="admin-bar-fill" style={{ width: `${(amount / maxCategory) * 100}%` }} /></span>
                      <span className="admin-strong">{formatCurrency(amount)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="admin-card">
                <h3 className="admin-strong">Recent Orders</h3>
                {report.recentOrders.map((order) => (
                  <div key={order.id} className="admin-toolbar" style={{ margin: '13px 0 0' }}>
                    <span>
                      <span className="admin-strong">#{order.id} {getCustomerName(order)}</span>
                      <span className="admin-muted" style={{ display: 'block' }}>{formatDate(order.created_at)}</span>
                    </span>
                    <span className="admin-strong">{formatCurrency(order.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

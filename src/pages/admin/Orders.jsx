import React, { useMemo, useState } from 'react';
import { FaPrint, FaSearch, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useFetch } from '../../hooks/useFetch';
import config from '../../config';
import './admin.css';
import { buildWhatsAppOrderUrl, formatCurrency, formatDate, getCustomerEmail, getCustomerName, getCustomerPhone, parseOrderItems } from './adminUtils';

const STATUS_META = {
  pending: 'admin-badge-yellow',
  processing: 'admin-badge-blue',
  shipped: 'admin-badge-purple',
  delivered: 'admin-badge-green',
  cancelled: 'admin-badge-red',
};

const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const { data: orders = [], loading, refetch } = useFetch('/orders/admin', { auth: true });
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const printInvoice = (order) => {
    const items = parseOrderItems(order.items);
    const customerName = getCustomerName(order);
    const customerEmail = getCustomerEmail(order);
    const customerPhone = getCustomerPhone(order);
    const formattedDate = formatDate(order.created_at);

    const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e1e1e; margin: 0; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
            .invoice-details { text-align: right; }
            .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .details-box h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
            .details-box p { margin: 5px 0; font-size: 15px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #eaeaea; color: #888; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
            .text-right { text-align: right; }
            .totals { display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 250px; padding: 8px 0; font-size: 14px; }
            .total-row.grand-total { font-size: 18px; font-weight: 800; border-top: 2px solid #1e1e1e; padding-top: 12px; margin-top: 8px; }
            .footer { border-top: 1px solid #eaeaea; padding-top: 20px; margin-top: 60px; text-align: center; color: #888; font-size: 12px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">NYF TOTH</div>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Premium Streetwear Atelier</p>
            </div>
            <div class="invoice-details">
              <h2 style="margin: 0; font-size: 24px; font-weight: 800;">INVOICE</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">Order #${order.id}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Date: ${formattedDate}</p>
            </div>
          </div>

          <div class="details-grid">
            <div class="details-box">
              <h3>Billed To</h3>
              <p><strong>${customerName}</strong></p>
              <p>${customerEmail}</p>
              <p>${customerPhone || 'No phone number'}</p>
            </div>
            <div class="details-box">
              <h3>Shipping Address</h3>
              <p>${order.shipping_address ? order.shipping_address.replace(/\\n/g, '<br />') : 'Not provided'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Details</th>
                <th class="text-right">Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => {
                const details = [
                  item.size ? 'Size: ' + item.size : '',
                  item.color ? 'Color: ' + item.color : ''
                ].filter(Boolean).join(' | ');
                return '<tr>' +
                  '<td><strong>' + item.name + '</strong></td>' +
                  '<td style="color: #666;">' + details + '</td>' +
                  '<td class="text-right">' + formatCurrency(item.price) + '</td>' +
                  '<td class="text-right">' + (item.quantity || 1) + '</td>' +
                  '<td class="text-right">' + formatCurrency(Number(item.price) * Number(item.quantity || 1)) + '</td>' +
                '</tr>';
              }).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>
            <div class="total-row grand-total">
              <span>Grand Total</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing NYF TOTH. Live premium.</p>
            <p style="margin-top: 5px; color: #bbb;">If you have any questions, contact us at nyftothcloth@gmail.com</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiUrl}/orders/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        refetch();
        setMessage('Order status updated.');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiUrl}/orders/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        refetch();
        setMessage('Order deleted.');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((order) => filterStatus === 'all' || order.status === filterStatus)
      .filter((order) => {
        if (!q) return true;
        return [
          order.id,
          getCustomerName(order),
          getCustomerEmail(order),
          getCustomerPhone(order),
          order.payment_method,
        ].some((value) => String(value || '').toLowerCase().includes(q));
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders, filterStatus, search]);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pending = orders.filter((order) => order.status === 'pending').length;
    const delivered = orders.filter((order) => order.status === 'delivered').length;
    return [
      { label: 'Total Orders', value: orders.length },
      { label: 'Order Revenue', value: formatCurrency(revenue) },
      { label: 'Pending', value: pending },
      { label: 'Delivered', value: delivered },
    ];
  }, [orders]);

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Fulfillment desk</p>
            <h1 className="admin-title">Orders</h1>
            <p className="admin-subtitle">Review orders, update fulfillment status, and message customers instantly on WhatsApp.</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          {metrics.map((metric) => (
            <div className="admin-card admin-stat" key={metric.label}>
              <p className="admin-stat-label">{metric.label}</p>
              <p className="admin-stat-value">{metric.value}</p>
            </div>
          ))}
        </div>

        {message && <div className="admin-card" style={{ marginTop: 16, color: '#86efac' }}>{message}</div>}

        <div className="admin-toolbar">
          <div className="admin-tabs">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`admin-tab ${filterStatus === status ? 'admin-tab-active' : ''}`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            ))}
          </div>
          <label style={{ position: 'relative' }}>
            <FaSearch style={{ color: '#777', left: 14, position: 'absolute', top: 13 }} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="admin-search"
              style={{ paddingLeft: 40 }}
            />
          </label>
        </div>

        {loading ? (
          <div className="admin-panel admin-empty">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-panel admin-empty">No orders found.</div>
        ) : (
          <div className="admin-panel admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const whatsAppUrl = buildWhatsAppOrderUrl(order);
                  const items = parseOrderItems(order.items);
                  return (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td className="admin-strong">#{order.id}</td>
                        <td>
                          <div className="admin-strong">{getCustomerName(order)}</div>
                          <div className="admin-muted">{getCustomerEmail(order)}</div>
                          <div className="admin-muted">{getCustomerPhone(order) || 'No phone'}</div>
                        </td>
                        <td className="admin-strong">{formatCurrency(order.total)}</td>
                        <td className="admin-muted">{order.payment_method || 'Not set'}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <span className={`admin-badge ${STATUS_META[order.status] || 'admin-badge-blue'}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <select
                              value={order.status || 'pending'}
                              onChange={(event) => updateStatus(order.id, event.target.value)}
                              className="admin-search"
                              style={{ minWidth: 140, padding: '9px 10px' }}
                            >
                              {statuses.slice(1).map((status) => (
                                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                              ))}
                            </select>
                            <a
                              className="admin-btn admin-btn-whatsapp"
                              href={whatsAppUrl || undefined}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => {
                                if (!whatsAppUrl) event.preventDefault();
                              }}
                            >
                              <FaWhatsapp /> Notify
                            </a>
                            <button onClick={() => printInvoice(order)} className="admin-btn" style={{ background: '#374151', color: 'white' }}>
                              <FaPrint /> Print
                            </button>
                            <button onClick={() => deleteOrder(order.id)} className="admin-btn admin-btn-danger">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7">
                          <div className="admin-order-items">
                            {items.map((item, index) => (
                              <div key={`${order.id}-${item.name}-${index}`} className="admin-order-item">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="admin-order-image"
                                    onError={(event) => { event.currentTarget.style.display = 'none'; }}
                                  />
                                )}
                                <div>
                                  <div className="admin-strong">{item.name}</div>
                                  <div className="admin-muted">
                                    Qty {item.quantity || 1}
                                    {item.size ? ` · Size ${item.size}` : ''}
                                    {item.color ? ` · ${item.color}` : ''}
                                  </div>
                                  <div className="admin-muted">{formatCurrency(item.price)} each</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="admin-muted" style={{ marginTop: 12 }}>Shipping: {order.shipping_address || 'Not available'}</p>
                        </td>
                      </tr>
                    </React.Fragment>
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

export default Orders;

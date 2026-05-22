import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaImage,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';
import logoUrl from '../assets/logo.png';

const AdminNavLink = ({ to, icon, label, active, sidebarOpen }) => (
  <Link
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: active ? '#fff' : '#666',
      textDecoration: 'none',
      borderLeft: active ? '3px solid #d4af37' : '3px solid transparent',
      background: active ? 'linear-gradient(90deg, rgba(212,175,55,.14), rgba(255,255,255,.03))' : 'transparent',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = '#111';
        e.currentTarget.style.color = '#fff';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#666';
      }
    }}>
    <span style={{ fontSize: '16px', color: active ? '#d4af37' : 'inherit' }}>{icon}</span>
    {sidebarOpen && <span>{label}</span>}
  </Link>
);

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050506' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '240px' : '72px',
        background: 'linear-gradient(180deg, #0d0d10 0%, #050506 100%)',
        borderRight: '1px solid rgba(255,255,255,.08)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={logoUrl}
                alt="Lovito"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(212,175,55,.35)',
                  boxShadow: '0 10px 28px rgba(212,175,55,.16)',
                }}
              />
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '1px' }}>
                  LOVITO
                </h2>
                <p style={{ margin: '2px 0 0', color: '#d4af37', fontSize: '11px', fontWeight: 700, letterSpacing: '.12em' }}>
                  ADMIN SUITE
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#666',
              padding: '7px 8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; }}
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <AdminNavLink to="/admin"          icon={<FaTachometerAlt />} label="Dashboard" active={isActive('/admin')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/orders"   icon={<FaClipboardList />} label="Orders" active={isActive('/admin/orders')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/customers" icon={<FaUserTie />} label="Customers" active={isActive('/admin/customers')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/reports"  icon={<FaChartLine />} label="Reports" active={isActive('/admin/reports')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/products" icon={<FaBoxOpen />} label="Products" active={isActive('/admin/products')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/banners"  icon={<FaImage />} label="Banners" active={isActive('/admin/banners')} sidebarOpen={sidebarOpen} />
          <AdminNavLink to="/admin/users"    icon={<FaUsers />} label="Users" active={isActive('/admin/users')} sidebarOpen={sidebarOpen} />
        </nav>

        {/* Logout */}
        <div style={{ borderTop: '1px solid #1a1a1a', padding: '12px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              color: '#ef4444',
              border: '1px solid #7f1d1d',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <span><FaSignOutAlt /></span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#050506' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

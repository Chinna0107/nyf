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
  FaTimes
} from 'react-icons/fa';
import logoUrl from '../assets/logo1.jpeg';

const AdminNavLink = ({ to, icon, label, active, sidebarOpen, isMobile, setSidebarOpen }) => (
  <Link
    to={to}
    onClick={() => isMobile && setSidebarOpen(false)}
    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-l-[3px] ${
      active 
        ? 'text-white border-[#d4af37] font-semibold bg-gradient-to-r from-[#d4af37]/10 to-white/5' 
        : 'text-gray-400 border-transparent hover:text-white hover:bg-[#111]'
    }`}
  >
    <span className={`text-base ${active ? 'text-[#d4af37]' : 'text-inherit'}`}>{icon}</span>
    {sidebarOpen && <span>{label}</span>}
  </Link>
);

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#050506] overflow-hidden">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[60px] bg-[#0d0d10] border-b border-white/10 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="NYF TOTH" className="w-8 h-8 rounded-full border border-[#d4af37]/30 object-cover" />
          <h2 className="text-white font-bold text-sm tracking-widest">ADMIN</h2>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="text-gray-400 hover:text-white p-2">
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative top-0 left-0 h-full bg-gradient-to-b from-[#0d0d10] to-[#050506] border-r border-white/10 flex flex-col z-50 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'md:w-64' : 'md:w-[72px]'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between min-h-[72px]">
          {(sidebarOpen || mobileMenuOpen) && (
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={logoUrl}
                alt="NYF TOTH"
                className="w-9 h-9 rounded-full object-cover border border-[#d4af37]/30 shadow-[0_10px_28px_rgba(212,175,55,0.16)] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="m-0 text-base font-extrabold text-white tracking-wide truncate">NYF TOTH</h2>
                <p className="m-0 text-[#d4af37] text-[10px] font-bold tracking-widest mt-0.5 truncate">ADMIN SUITE</p>
              </div>
            </div>
          )}
          
          {/* Desktop Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex bg-transparent border border-[#333] rounded-md p-2 text-gray-400 hover:text-white hover:border-white transition-all ml-auto flex-shrink-0"
          >
            <FaBars />
          </button>
          
          {/* Mobile Close */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-white flex-shrink-0 ml-auto"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <AdminNavLink to="/admin" icon={<FaTachometerAlt />} label="Dashboard" active={isActive('/admin')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/orders" icon={<FaClipboardList />} label="Orders" active={isActive('/admin/orders')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/customers" icon={<FaUserTie />} label="Customers" active={isActive('/admin/customers')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/reports" icon={<FaChartLine />} label="Reports" active={isActive('/admin/reports')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/products" icon={<FaBoxOpen />} label="Products" active={isActive('/admin/products')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/banners" icon={<FaImage />} label="Banners" active={isActive('/admin/banners')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
          <AdminNavLink to="/admin/users" icon={<FaUsers />} label="Users" active={isActive('/admin/users')} sidebarOpen={sidebarOpen || mobileMenuOpen} isMobile={mobileMenuOpen} setSidebarOpen={setMobileMenuOpen} />
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#1a1a1a]">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border font-semibold text-sm transition-all ${
              (sidebarOpen || mobileMenuOpen) ? 'justify-start' : 'justify-center'
            } text-red-500 border-red-900/50 bg-transparent hover:bg-red-900 hover:text-white`}
          >
            <span><FaSignOutAlt /></span>
            {(sidebarOpen || mobileMenuOpen) && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#050506] pt-[60px] md:pt-0">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

const UserDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'User';

  const endpoint = userEmail ? `/orders?email=${encodeURIComponent(userEmail)}` : null;
  const { data: orders = [], loading } = useFetch(endpoint || '', { deps: [userEmail] });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn || !userEmail) navigate('/login');
  }, [navigate, userEmail]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900 text-yellow-300',
      processing: 'bg-blue-900 text-blue-300',
      shipped: 'bg-indigo-900 text-indigo-300',
      delivered: 'bg-green-900 text-green-300',
      cancelled: 'bg-red-900 text-red-300',
    };
    return colors[status] || 'bg-gray-800 text-gray-400';
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userName}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
            Logout
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <p className="text-gray-400">Total Orders</p>
          <div className="text-3xl font-bold text-white">{orders.length}</div>
        </div>

        <div className="bg-gray-900 rounded-lg">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Your Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No orders found</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-white font-semibold">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm space-y-1 mb-3">
                    <p>Date: {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                    <p>Total: ₹{parseFloat(order.total || 0).toFixed(2)}</p>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-gray-400 text-sm">
                          {item.name} × {item.quantity} — ₹{parseFloat(item.price || 0).toFixed(2)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

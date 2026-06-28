import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBox, FiCalendar, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency, formatDate, getItemImage, getOrderProgress, getStatusTone, orderStatuses, parseOrderItems } from './orderUtils';

const MyOrders = () => {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'there';
  const endpoint = userEmail ? `/orders?email=${encodeURIComponent(userEmail)}` : '';
  const { data: orders = [], loading } = useFetch(endpoint, { deps: [userEmail] });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase().replace('#', '');
    return sortedOrders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const items = parseOrderItems(order.items);
      const matchesQuery = !q || [
        order.id,
        order.status,
        order.total,
        ...items.map((item) => item.name),
      ].some((value) => String(value || '').toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [sortedOrders, query, status]);

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const activeOrders = orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length;

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">Your account</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0c0c0e] md:text-6xl">My Orders</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Welcome back, {userName}. Review every NYF TOTH order, track live status, and revisit the pieces you picked.
              </p>
            </div>
            <Link to="/order-tracking" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0c0c0e] px-5 py-3 text-sm font-bold text-white hover:bg-[#d4af37] hover:text-[#0c0c0e]">
              Track an order <FiArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Total orders', value: orders.length, icon: <FiPackage /> },
              { label: 'Active orders', value: activeOrders, icon: <FiTruck /> },
              { label: 'Total spent', value: formatCurrency(totalSpent), icon: <FiBox /> },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl border border-gray-100 bg-[#fbfbfc] p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0c0c0e] text-[#d4af37]">
                  {card.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-[#0c0c0e]">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative max-w-md flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order ID, item, or status"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm focus:border-[#d4af37] focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition-colors ${
                  status === item ? 'border-[#0c0c0e] bg-[#0c0c0e] text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-[#d4af37] hover:text-[#0c0c0e]'
                }`}
              >
                {item === 'all' ? 'All orders' : item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500">Loading your orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <FiPackage className="mx-auto mb-4 text-4xl text-[#d4af37]" />
            <h2 className="text-2xl font-bold text-[#0c0c0e]">No orders found</h2>
            <p className="mt-2 text-sm text-gray-500">Your matching orders will appear here after checkout.</p>
            <Link to="/tshirts" className="mt-6 inline-flex rounded-full bg-[#0c0c0e] px-5 py-3 text-sm font-bold text-white hover:bg-[#d4af37] hover:text-[#0c0c0e]">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const items = parseOrderItems(order.items);
              const progress = getOrderProgress(order.status);

              return (
                <article key={order.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-[#0c0c0e]">Order #{order.id}</h2>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusTone(order.status)}`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <FiCalendar /> Placed {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Order total</p>
                      <p className="text-2xl font-bold text-[#0c0c0e]">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-3">
                      {items.length === 0 ? (
                        <p className="rounded-xl bg-[#fbfbfc] p-4 text-sm text-gray-500">Item details are not available.</p>
                      ) : items.slice(0, 3).map((item, index) => {
                        const image = getItemImage(item);
                        return (
                          <div key={`${order.id}-${item.name}-${index}`} className="flex gap-4 rounded-xl border border-gray-100 bg-[#fbfbfc] p-3">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              {image ? (
                                <img src={image} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-xs text-gray-400">No image</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-[#0c0c0e]">{item.name}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                Qty {item.quantity || 1}
                                {item.size ? ` · Size ${item.size}` : ''}
                                {item.color ? ` · ${item.color}` : ''}
                              </p>
                              <p className="mt-2 text-sm font-bold text-[#0c0c0e]">{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="mb-4 text-sm font-bold text-[#0c0c0e]">Fulfillment progress</p>
                      <div className="space-y-3">
                        {orderStatuses.map((step, index) => (
                          <div key={step} className="flex items-center gap-3">
                            <span className={`h-3 w-3 rounded-full ${progress >= index ? 'bg-[#d4af37]' : 'bg-gray-200'}`} />
                            <span className={`text-sm font-semibold capitalize ${progress >= index ? 'text-[#0c0c0e]' : 'text-gray-400'}`}>{step}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/order-tracking?order=${order.id}`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0c0c0e] px-4 py-3 text-sm font-bold text-[#0c0c0e] hover:bg-[#0c0c0e] hover:text-white"
                      >
                        Track details <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyOrders;

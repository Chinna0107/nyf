import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiClipboard, FiClock, FiMapPin, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency, formatDate, getItemImage, getOrderProgress, getStatusTone, orderStatuses, parseOrderItems } from './orderUtils';

const stepIcons = {
  pending: <FiClock />,
  processing: <FiClipboard />,
  shipped: <FiTruck />,
  delivered: <FiCheckCircle />,
};

const OrderTracking = () => {
  const userEmail = localStorage.getItem('userEmail');
  const endpoint = userEmail ? `/orders?email=${encodeURIComponent(userEmail)}` : '';
  const { data: orders = [], loading } = useFetch(endpoint, { deps: [userEmail] });
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('order') || '');

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [orders]
  );

  const order = useMemo(() => {
    const normalized = query.trim().replace('#', '').toLowerCase();
    if (!normalized) return sortedOrders[0];
    return sortedOrders.find((item) => String(item.id).toLowerCase() === normalized);
  }, [sortedOrders, query]);

  const items = parseOrderItems(order?.items);
  const progress = getOrderProgress(order?.status);
  const progressPercent = order?.status === 'cancelled' ? 0 : ((progress + 1) / orderStatuses.length) * 100;

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      <section className="relative overflow-hidden bg-[#0c0c0e] px-4 py-14 text-white md:px-8 md:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">Order concierge</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Order Tracking</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">
                Follow your NYF TOTH order from confirmation to delivery with a clean, real-time status view.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
              <label className="relative block">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search order ID"
                  className="w-full rounded-full border border-white/10 bg-white px-12 py-3 text-sm font-semibold text-[#0c0c0e] placeholder:text-gray-400 focus:border-[#d4af37] focus:outline-none"
                />
              </label>
              <Link to="/my-orders" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#0c0c0e] hover:bg-white">
                View all orders <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500">Loading tracking details...</div>
        ) : !order ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <FiMapPin className="mx-auto mb-4 text-4xl text-[#d4af37]" />
            <h2 className="text-2xl font-bold text-[#0c0c0e]">No order found</h2>
            <p className="mt-2 text-sm text-gray-500">Check the order ID and try again, or view your full order history.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-bold text-[#0c0c0e]">Order #{order.id}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusTone(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Placed {formatDate(order.created_at)}</p>
                </div>
                <div className="rounded-2xl bg-[#fbfbfc] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-[#0c0c0e]">{formatCurrency(order.total)}</p>
                </div>
              </div>

              {order.status === 'cancelled' ? (
                <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
                  This order has been cancelled. Please contact support if you need help.
                </div>
              ) : (
                <div className="mt-8">
                  <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    {orderStatuses.map((step, index) => {
                      const active = progress >= index;
                      return (
                        <div key={step} className={`rounded-2xl border p-5 ${active ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-gray-100 bg-[#fbfbfc]'}`}>
                          <div className={`mb-4 grid h-11 w-11 place-items-center rounded-full text-lg ${active ? 'bg-[#0c0c0e] text-[#d4af37]' : 'bg-gray-200 text-gray-500'}`}>
                            {stepIcons[step]}
                          </div>
                          <p className="text-sm font-bold capitalize text-[#0c0c0e]">{step}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {active ? 'Completed' : 'Awaiting update'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10">
                <h3 className="text-xl font-bold text-[#0c0c0e]">Order Items</h3>
                <div className="mt-4 grid gap-3">
                  {items.length === 0 ? (
                    <p className="rounded-xl bg-[#fbfbfc] p-4 text-sm text-gray-500">Item details are not available.</p>
                  ) : items.map((item, index) => {
                    const image = getItemImage(item);
                    return (
                      <div key={`${item.name}-${index}`} className="flex gap-4 rounded-2xl border border-gray-100 bg-[#fbfbfc] p-4">
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
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0c0c0e]">Delivery Details</h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Shipping address</p>
                    <p className="mt-1 font-semibold text-[#0c0c0e]">{order.shipping_address || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment method</p>
                    <p className="mt-1 font-semibold capitalize text-[#0c0c0e]">{order.payment_method || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#0c0c0e] p-6 text-white shadow-sm">
                <FiPackage className="mb-4 text-3xl text-[#d4af37]" />
                <h3 className="text-lg font-bold text-white">Need support?</h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Keep your order ID ready and contact NYF TOTH support for delivery changes or fulfillment questions.
                </p>
                <Link to="/contact" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0c0c0e] hover:bg-[#d4af37]">
                  Contact support <FiArrowRight />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default OrderTracking;

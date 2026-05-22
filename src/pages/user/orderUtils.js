export const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];

export const parseOrderItems = (items) => {
  if (Array.isArray(items)) return items;
  if (!items) return [];

  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusTone = (status = 'pending') => {
  const tones = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-sky-50 text-sky-700 border-sky-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return tones[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getOrderProgress = (status = 'pending') => {
  if (status === 'cancelled') return -1;
  return Math.max(0, orderStatuses.indexOf(status));
};

export const getItemImage = (item = {}) => item.image || item.image_url || '';

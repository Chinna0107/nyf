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

export const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits;
};

export const getCustomerPhone = (customer = {}) =>
  customer.customer_phone ||
  customer.phone ||
  customer.phone_number ||
  customer.mobile ||
  customer.mobile_number ||
  customer.contact_number ||
  '';

export const getCustomerName = (customer = {}) => {
  const directName = customer.customer_name || customer.name;
  if (directName) return directName;

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(' ');
  return fullName || 'Guest customer';
};

export const getCustomerEmail = (customer = {}) => customer.customer_email || customer.email || 'No email';

export const buildWhatsAppOrderUrl = (order) => {
  const phone = normalizePhone(getCustomerPhone(order));
  if (!phone) return '';

  const message = encodeURIComponent(
    `Hi ${getCustomerName(order)}, we have received your order #${order.id}. Thanks for choosing us.`
  );

  return `https://wa.me/${phone}?text=${message}`;
};

export const buildCustomerStats = (users = [], orders = []) => {
  const customersByEmail = new Map();

  users.forEach((user) => {
    const email = getCustomerEmail(user).toLowerCase();
    const key = email === 'no email' ? `user-${user.id}` : email;
    customersByEmail.set(email, {
      id: user.id || email,
      name: getCustomerName(user),
      email: getCustomerEmail(user),
      phone: getCustomerPhone(user),
      joined: user.created_at,
      orders: 0,
      spent: 0,
      lastOrder: null,
    });
    if (key !== email) {
      const customer = customersByEmail.get(email);
      customersByEmail.delete(email);
      customersByEmail.set(key, customer);
    }
  });

  orders.forEach((order) => {
    const email = getCustomerEmail(order).toLowerCase();
    const key = email === 'no email' ? `order-${order.id}` : email;
    const existing = customersByEmail.get(key) || {
      id: key || order.customer_phone || order.id,
      name: getCustomerName(order),
      email: getCustomerEmail(order),
      phone: getCustomerPhone(order),
      joined: order.created_at,
      orders: 0,
      spent: 0,
      lastOrder: null,
    };

    existing.name = existing.name === 'Guest customer' ? getCustomerName(order) : existing.name;
    existing.phone = existing.phone || getCustomerPhone(order);
    existing.orders += 1;
    existing.spent += Number(order.total || 0);

    const orderDate = order.created_at ? new Date(order.created_at) : null;
    const lastDate = existing.lastOrder ? new Date(existing.lastOrder) : null;
    if (orderDate && (!lastDate || orderDate > lastDate)) existing.lastOrder = order.created_at;

    customersByEmail.set(key, existing);
  });

  return Array.from(customersByEmail.values()).sort((a, b) => b.spent - a.spent);
};

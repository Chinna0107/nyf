import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const API_BASE_URL = config.apiUrl;

const PAYMENT_METHODS = [
  { id: 'cod',         label: 'Cash on Delivery', icon: '💵' },
  { id: 'upi',         label: 'UPI',               icon: '📱' },
  { id: 'card',        label: 'Credit / Debit Card',icon: '💳' },
  { id: 'netbanking',  label: 'Net Banking',        icon: '🏦' },
];

const inputCls = 'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm';
const labelCls = 'block mb-1.5 text-white font-semibold text-sm';
const errorCls = 'text-red-400 text-xs mt-1';

const Field = ({ label, error, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
    {error && <p className={errorCls}>{error}</p>}
  </div>
);

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '',
    // card
    cardName: '', cardNumber: '', expiryDate: '', cvv: '',
    // upi
    upiId: '',
    // net banking
    bank: '',
  });

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const tax      = subtotal * 0.1;
  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal + tax + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    if (!form.phone.trim()) {
      e.phone = 'Required';
    } else if (form.phone.replace(/[^\d]/g, '').length < 10) {
      e.phone = 'Enter a valid phone number';
    }
    if (!form.address.trim())   e.address   = 'Required';
    if (!form.city.trim())      e.city      = 'Required';
    if (!form.state.trim())     e.state     = 'Required';
    if (!form.zipCode.trim())   e.zipCode   = 'Required';

    if (paymentMethod === 'card') {
      if (!form.cardName.trim())   e.cardName   = 'Required';
      if (!form.cardNumber.trim()) e.cardNumber = 'Required';
      if (!form.expiryDate.trim()) e.expiryDate = 'Required';
      if (!form.cvv.trim())        e.cvv        = 'Required';
    }
    if (paymentMethod === 'upi' && !form.upiId.trim()) e.upiId = 'Enter UPI ID';
    if (paymentMethod === 'netbanking' && !form.bank)  e.bank  = 'Select a bank';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');

    const orderPayload = {
      customer_name:   `${form.firstName} ${form.lastName}`,
      customer_email:  form.email,
      customer_phone:  form.phone,
      shipping_address: `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}`,
      payment_method:  paymentMethod,
      payment_details: paymentMethod === 'upi'        ? { upi_id: form.upiId }
                     : paymentMethod === 'card'       ? { card_last4: form.cardNumber.slice(-4), card_name: form.cardName }
                     : paymentMethod === 'netbanking' ? { bank: form.bank }
                     : {},
      items: cart.map(item => ({
        product_id: item.productId || item.id,
        name:       item.name,
        size:       item.size,
        color:      item.color,
        quantity:   item.quantity,
        price:      parseFloat(item.price),
        image:      item.image,
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax:      parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total:    parseFloat(total.toFixed(2)),
      status:   'pending',
    };

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.order_id || data.id || data.order?.id || 'Created');
        clearCart();
        setOrderPlaced(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.message || 'Could not create your order. Please try again.');
      }
    } catch {
      setSubmitError('Could not connect to the order server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) return (
    <div className="bg-black min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <button onClick={() => navigate('/')} className="bg-white text-black px-8 py-3 font-bold rounded-lg hover:bg-gray-100 transition-all">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (orderPlaced) return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Placed!</h1>
        <p className="text-gray-400 mb-6 text-sm">Thank you! Your order has been received.</p>
        <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Order ID</p>
          <p className="text-white text-xl font-bold">#{String(orderId).toUpperCase()}</p>
          <p className="text-gray-400 text-xs mt-2">Payment: <span className="text-white capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Net Banking'}</span></p>
          <p className="text-gray-400 text-xs mt-1">Total: <span className="text-white font-bold">₹{total.toFixed(2)}</span></p>
        </div>
        <button onClick={() => navigate('/')} className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Checkout</h1>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6 md:gap-8`}>
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
            {submitError && (
              <div className="bg-red-950 border border-red-800 text-red-200 rounded-xl px-4 py-3 text-sm">
                {submitError}
              </div>
            )}

            {/* Shipping */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-bold text-white mb-5">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="First Name" error={errors.firstName}>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="John" />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Doe" />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field label="Email" error={errors.email}>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 9999999999" />
                </Field>
              </div>
              <div className="mb-4">
                <Field label="Address" error={errors.address}>
                  <input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="123, Street Name" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City" error={errors.city}>
                  <input name="city" value={form.city} onChange={handleChange} className={inputCls} placeholder="Mumbai" />
                </Field>
                <Field label="State" error={errors.state}>
                  <input name="state" value={form.state} onChange={handleChange} className={inputCls} placeholder="MH" />
                </Field>
                <Field label="PIN Code" error={errors.zipCode}>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} className={inputCls} placeholder="400001" />
                </Field>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-bold text-white mb-5">Payment Method</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === m.id
                        ? 'border-white bg-white/10 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-xs font-semibold text-center leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* COD */}
              {paymentMethod === 'cod' && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-white font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-gray-400 text-xs mt-1">Pay with cash when your order is delivered. No extra charges.</p>
                  </div>
                </div>
              )}

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex gap-3 flex-wrap">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <span key={app} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 font-medium">{app}</span>
                    ))}
                  </div>
                  <Field label="UPI ID" error={errors.upiId}>
                    <input name="upiId" value={form.upiId} onChange={handleChange} className={inputCls} placeholder="yourname@upi" />
                  </Field>
                </div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Field label="Cardholder Name" error={errors.cardName}>
                    <input name="cardName" value={form.cardName} onChange={handleChange} className={inputCls} placeholder="John Doe" />
                  </Field>
                  <Field label="Card Number" error={errors.cardNumber}>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputCls} placeholder="1234 5678 9012 3456" maxLength="19" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry Date" error={errors.expiryDate}>
                      <input name="expiryDate" value={form.expiryDate} onChange={handleChange} className={inputCls} placeholder="MM/YY" maxLength="5" />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                      <input name="cvv" value={form.cvv} onChange={handleChange} className={inputCls} placeholder="•••" maxLength="4" type="password" />
                    </Field>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>🔒</span><span>Your card details are encrypted and secure</span>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <Field label="Select Bank" error={errors.bank}>
                    <select name="bank" value={form.bank} onChange={handleChange} className={inputCls}>
                      <option value="">-- Choose your bank --</option>
                      {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB', 'Bank of Baroda', 'Canara Bank', 'Union Bank', 'Other'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-xs text-gray-400">
                    You will be redirected to your bank's secure portal to complete the payment.
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1 h-fit bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

            <div className="max-h-56 overflow-y-auto mb-5 space-y-3 pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="text-white font-semibold line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.size} {item.color && `· ${item.color}`} × {item.quantity}</p>
                  </div>
                  <span className="text-white font-bold ml-2 flex-shrink-0">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-3 mb-5">
              <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-400"><span>Tax (10%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-4 mb-6">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>

            <div className="mb-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-2 text-xs text-gray-400">
              <span>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon}</span>
              <span>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 mb-3 ${
                loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg'
              }`}>
              {loading ? 'Placing Order...' : `Place Order · ₹${total.toFixed(2)}`}
            </button>

            <button onClick={() => navigate('/cart')}
              className="w-full py-3 rounded-lg font-bold text-sm border-2 border-gray-700 text-white hover:border-white transition-all duration-300">
              ← Back to Cart
            </button>

            {shipping === 0 && (
              <p className="mt-4 text-center text-green-400 text-xs font-semibold">✓ Free shipping applied!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

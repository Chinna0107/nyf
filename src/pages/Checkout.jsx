import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import config from '../config';
import { getProductImage } from '../utils/productImages';
import toast from 'react-hot-toast';

const API_BASE_URL = config.apiUrl;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const inputCls = 'w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-sm';
const labelCls = 'block mb-1.5 text-gray-300 font-medium text-xs tracking-wide uppercase';
const errorCls = 'text-red-400 text-xs mt-1';

const fallbackImg = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&q=75&w=600&h=760&fit=crop';

const Field = ({ label, error, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
    {error && <p className={errorCls}>{error}</p>}
  </div>
);

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Address Book state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.error("Please login to proceed to checkout.");
      navigate('/login');
      return;
    }

    const fetchAddresses = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch(`${API_BASE_URL}/user/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          if (data.length > 0) {
            const defaultAddr = data.find(a => a.is_default) || data[0];
            handleSelectAddress(defaultAddr);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };
    fetchAddresses();
  }, [navigate]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    setForm({
      firstName: addr.first_name,
      lastName: addr.last_name,
      email: addr.email,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateAddress = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) {
      e.phone = 'Required';
    } else if (form.phone.replace(/[^\d]/g, '').length < 10) {
      e.phone = 'Enter a valid phone number';
    }
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!form.zipCode.trim()) e.zipCode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddressSubmit = async () => {
    setSubmitError('');
    if (showNewAddressForm) {
      if (!validateAddress()) return;
      
      setLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch(`${API_BASE_URL}/user/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ...form, isDefault: true })
        });
        if (res.ok) {
          const newAddr = await res.json();
          setAddresses(prev => [newAddr, ...prev.map(a => ({...a, is_default: false}))]);
          handleSelectAddress(newAddr);
          setStep(3);
        } else {
          setSubmitError('Failed to save address.');
        }
      } catch {
        setSubmitError('Error saving address.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedAddressId) {
        setSubmitError('Please select an address or add a new one.');
        return;
      }
      setStep(3);
    }
  };

  const goToStep = (target) => {
    if (target === 2 && step === 1) {
      setStep(2);
    } else if (target === 3 && step === 2) {
      handleAddressSubmit();
    } else if (target < step) {
      setStep(target);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayWithRazorpay = async () => {
    setLoading(true);
    setSubmitError('');

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setSubmitError('Failed to load Razorpay. Please check your connection.');
        setLoading(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const rzRes = await fetch(`${API_BASE_URL}/orders/create-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      if (!rzRes.ok) {
        const err = await rzRes.json().catch(() => ({}));
        setSubmitError(err.message || 'Failed to create payment order.');
        setLoading(false);
        return;
      }

      const rzData = await rzRes.json();

      // 3. Open Razorpay modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rzData.amount,
        currency: rzData.currency,
        name: 'NYF TOTH',
        description: `Order — ${cart.length} item(s)`,
        order_id: rzData.razorpay_order_id,
        handler: async function (response) {
          // 4. Verify payment
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // 5. Place the order in DB
              await placeOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
            } else {
              setSubmitError('Payment verification failed. Please contact support.');
              setLoading(false);
            }
          } catch {
            setSubmitError('Payment verification error. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#d4af37' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const placeOrder = async (paymentDetails) => {
    const orderPayload = {
      customer_name: `${form.firstName} ${form.lastName}`,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}`,
      payment_method: 'razorpay',
      payment_details: paymentDetails,
      items: cart.map(item => ({
        product_id: item.productId || item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: parseFloat(item.price),
        image: item.image,
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'paid',
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
        setOrderId(data.order_id || data.id || 'Created');
        clearCart();
        setOrderPlaced(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.message || 'Could not create your order.');
      }
    } catch {
      setSubmitError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Empty Cart ───
  if (cart.length === 0 && !orderPlaced) return (
    <div className="bg-black min-h-screen flex items-center justify-center p-8 pt-24">
      <div className="text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 text-sm">Add some products to get started</p>
        <button onClick={() => navigate('/')} className="bg-white text-black px-8 py-3 font-bold rounded-xl hover:bg-gray-100 transition-all">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  // ─── Order Confirmed ───
  if (orderPlaced) return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-green-500/30">
            ✓
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 mb-8 text-sm">Thank you for shopping with NYF TOTH</p>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8 text-left space-y-4">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-white text-2xl font-bold">#{String(orderId).toUpperCase()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Payment</p>
              <p className="text-white font-semibold text-sm">Razorpay ✓</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-[#d4af37] font-bold text-lg">₹{total.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Shipping To</p>
            <p className="text-white text-sm">{form.firstName} {form.lastName}</p>
            <p className="text-gray-400 text-xs">{form.address}, {form.city}, {form.state} - {form.zipCode}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/')} className="flex-1 bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all">
            Back to Home
          </button>
          <button onClick={() => navigate('/my-orders')} className="flex-1 border-2 border-gray-700 text-white py-3.5 rounded-xl font-bold hover:border-white transition-all">
            Track Orders
          </button>
        </div>
      </div>
    </div>
  );

  // ─── 3-Step Checkout ───
  return (
    <div className="bg-black min-h-screen p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-5xl mx-auto">

        {/* Stepper Header */}
        <div className="flex items-center justify-center mb-10">
          {[
            { num: 1, label: 'Cart Review' },
            { num: 2, label: 'Address' },
            { num: 3, label: 'Payment' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => s.num < step && goToStep(s.num)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 ${
                  step === s.num
                    ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                    : step > s.num
                    ? 'bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-black text-[#d4af37]' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline text-sm">{s.label}</span>
              </button>
              {i < 2 && (
                <div
                  style={{ marginTop: '-15px' }}
                  className={`w-12 md:w-20 h-0.5 mx-1 rounded transition-colors duration-300 ${
                    step > s.num ? 'bg-green-500' : 'bg-gray-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {submitError && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-950 border border-red-800 text-red-200 rounded-xl px-4 py-3 text-sm">
            {submitError}
          </div>
        )}

        {/* ─── STEP 1: Cart Review ─── */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Review Your Cart</h2>

            <div className="space-y-3 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4 items-center">
                  <img
                    src={getProductImage(item) || item.image || fallbackImg}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-800 flex-shrink-0"
                    onError={(e) => { e.target.src = fallbackImg; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.size && <span>{item.size}</span>}
                      {item.color && <span> · {item.color}</span>}
                    </p>
                    <p className="text-[#d4af37] font-bold text-sm mt-1">₹{parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
                    >−</button>
                    <span className="text-white font-bold w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
                    >+</button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-sm">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-400 text-xs mt-1 hover:text-red-300 transition-colors"
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-3 mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {shipping === 0 && (
                <p className="text-green-400 text-xs font-semibold mb-4 text-center">✓ Free shipping applied!</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-700 text-white hover:border-white transition-all"
                >← Back to Cart</button>
                <button
                  onClick={() => goToStep(2)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#d4af37] text-black hover:bg-[#c9a432] transition-all"
                >Continue to Address →</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Address ─── */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>

            {/* Address Selection Cards */}
            {addresses.length > 0 && !showNewAddressForm && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-[#d4af37] bg-[#d4af37]/10' 
                          : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-bold text-sm">{addr.first_name} {addr.last_name}</p>
                        {addr.is_default && <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded uppercase">Default</span>}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {addr.address}<br/>
                        {addr.city}, {addr.state} - {addr.zip_code}<br/>
                        {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    setShowNewAddressForm(true);
                    setSelectedAddressId(null);
                    setForm({firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: ''});
                  }}
                  className="text-[#d4af37] text-sm font-bold hover:underline flex items-center gap-1"
                >
                  <span>+</span> Add a new address
                </button>
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || addresses.length === 0) && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4 mb-6 relative">
                {addresses.length > 0 && (
                  <button 
                    onClick={() => {
                      setShowNewAddressForm(false);
                      handleSelectAddress(addresses[0]);
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                )}
                <h3 className="text-lg font-bold text-white mb-4">Add New Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" error={errors.firstName}>
                    <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="John" />
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Doe" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email" error={errors.email}>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 9999999999" />
                  </Field>
                </div>
                <Field label="Address" error={errors.address}>
                  <input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="123, Street Name" />
                </Field>
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
            )}

            <div className="flex gap-3">
              <button
                onClick={() => goToStep(1)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-700 text-white hover:border-white transition-all"
              >← Back to Cart</button>
              <button
                onClick={handleAddressSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#d4af37] text-black hover:bg-[#c9a432] transition-all flex justify-center items-center gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : null}
                {showNewAddressForm ? 'Save & Continue →' : 'Continue to Payment →'}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Payment ─── */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary & Payment</h2>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
              {/* Shipping Address */}
              <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-700">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Shipping To</p>
                  <p className="text-white font-semibold text-sm">{form.firstName} {form.lastName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{form.address}, {form.city}, {form.state} - {form.zipCode}</p>
                  <p className="text-gray-400 text-xs">{form.email} · {form.phone}</p>
                </div>
                <button onClick={() => goToStep(2)} className="text-[#d4af37] text-xs font-bold hover:underline">Edit</button>
              </div>

              {/* Items */}
              <div className="mb-5 pb-5 border-b border-gray-700">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</p>
                <div className="space-y-2">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(item) || item.image || fallbackImg}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md bg-gray-800"
                          onError={(e) => { e.target.src = fallbackImg; }}
                        />
                        <div>
                          <p className="text-white font-medium text-xs truncate max-w-[200px]">{item.name}</p>
                          <p className="text-gray-500 text-[11px]">{item.size} {item.color && `· ${item.color}`} × {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-white font-bold text-sm">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-4">
                <span>Total</span>
                <span className="text-[#d4af37]">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Razorpay Pay Button */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                <div>
                  <p className="text-white font-semibold text-sm">Pay with Razorpay</p>
                  <p className="text-gray-500 text-xs">UPI · Cards · Net Banking · Wallets</p>
                </div>
              </div>
              <button
                onClick={handlePayWithRazorpay}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                  loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#d4af37] text-black hover:bg-[#c9a432] hover:-translate-y-0.5 shadow-lg shadow-[#d4af37]/20'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => goToStep(2)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-700 text-white hover:border-white transition-all"
              >← Back to Address</button>
              <button
                onClick={() => navigate('/cart')}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-700 text-gray-400 hover:border-gray-500 transition-all"
              >Cancel</button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-gray-600 text-xs">
              <span>🔒</span>
              <span>Secured by Razorpay · 256-bit SSL encryption</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="bg-black min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center pt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Bag is Empty</h1>
          <p className="text-gray-400 mb-8 text-base md:text-lg">Add some products to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-8 py-3 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 mt-12">Shopping Bag</h1>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6 md:gap-8`}>
          {/* Cart Items */}
          <div className={isMobile ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              {isMobile ? (
                // Mobile Layout
                <div className="flex flex-col gap-4 p-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 grid grid-cols-3 gap-3 p-3"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded-lg col-span-1"
                      />

                      {/* Product Details */}
                      <div className="col-span-2 flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-white line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Size: <span className="text-white font-bold">{item.size}</span>
                        </p>
                        <p className="text-sm font-bold text-white">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="w-6 h-6 border border-gray-600 bg-gray-700 text-white rounded text-xs font-bold hover:bg-gray-600"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-white text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-600 bg-gray-700 text-white rounded text-xs font-bold hover:bg-gray-600"
                          >
                            +
                          </button>
                        </div>

                        {/* Total Price */}
                        <p className="text-xs font-bold text-white mt-1">
                          Total: ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="w-full py-1 bg-red-700 text-white text-xs font-bold rounded hover:bg-red-800 transition-colors mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop Layout
                <div>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-5 gap-4 p-6 items-center ${index !== cart.length - 1 ? 'border-b border-gray-700' : ''}`}
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-700"
                      />

                      {/* Product Details */}
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-bold text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Size: <span className="text-white font-bold">{item.size}</span>
                        </p>
                        <p className="text-base font-bold text-white">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 justify-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-600 bg-gray-800 text-white rounded font-bold hover:bg-gray-700"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-white font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-600 bg-gray-800 text-white rounded font-bold hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-base font-bold text-white">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="bg-red-700 text-white px-4 py-2 rounded font-bold hover:bg-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkout Section */}
          <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${isMobile ? 'col-span-1' : 'lg:col-span-1'} h-fit`}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-700">
              <div className="flex justify-between text-sm md:text-base text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500 font-bold' : 'text-gray-400'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg md:text-xl font-bold text-white mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if (!isLoggedIn) {
                  toast.error("Please login to proceed to checkout.");
                  navigate('/login');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/tshirts')}
              className="w-full bg-transparent text-white border-2 border-white py-3 rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-300"
            >
              Continue Shopping
            </button>

            {subtotal > 999 && (
              <div className="mt-4 p-3 bg-green-900 rounded-lg border border-green-600 text-green-400 text-xs md:text-sm text-center font-bold">
                ✓ Free shipping on this order!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

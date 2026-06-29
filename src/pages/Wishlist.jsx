import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, Link } from 'react-router-dom';
import { getProductImage } from '../utils/productImages';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="bg-black min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center pt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-400 mb-8 text-base md:text-lg">Find something you love and add it here!</p>
          <button
            onClick={() => navigate('/tshirts')}
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 mt-12">Your Wishlist</h1>

        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 p-4 md:p-6">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-6`}>
            {wishlist.map((item, index) => {
              const currentPrice = item.price;
              const discount = item.original_price && item.original_price > currentPrice
                ? Math.round(((item.original_price - currentPrice) / item.original_price) * 100) : 0;
                
              return (
                <div key={index} className="bg-[#0c0c0e] rounded-2xl overflow-hidden border border-gray-900 hover:border-gray-800 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative flex flex-col h-full transform hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-950 relative">
                    <img
                      src={getProductImage(item) || ''}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">
                        -{discount}%
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                      className="absolute top-3 right-3 bg-red-600/90 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-red-700 hover:scale-110 transition-all"
                      title="Remove from Wishlist"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between bg-[#0c0c0e]">
                    <div>
                      <p className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase mb-1">{item.category || 'NYF TOTH'}</p>
                      <p className="font-semibold text-sm line-clamp-2 min-h-[40px] text-gray-200">{item.name}</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-900">
                      <div className="flex items-baseline gap-2">
                        <span className="text-white font-bold text-base">₹{item.price}</span>
                        {item.original_price && item.original_price > item.price && (
                          <span className="text-gray-500 text-xs line-through">₹{item.original_price}</span>
                        )}
                      </div>
                      <Link to={`/product/${item.id}`} className="w-full text-center bg-white text-black py-2 rounded font-bold hover:bg-gray-200 transition-colors">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

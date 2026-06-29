/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';
import toast from 'react-hot-toast';

const FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const colorMap = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00',
  purple: '#800080',
  orange: '#ffa500',
  pink: '#ffc0cb',
  gray: '#808080',
  grey: '#808080',
  navy: '#000080',
  beige: '#f5f5dc',
  brown: '#a52a2a',
  maroon: '#800000',
  gold: '#ffd700',
  silver: '#c0c0c0',
  lavender: '#e6e6fa',
  peach: '#ffdab9',
  olive: '#808000',
  teal: '#008080',
  turquoise: '#40e0d0',
  cream: '#fffdd0',
  burgundy: '#800020',
  charcoal: '#36454f',
  mustard: '#ffdb58',
  khaki: '#c3b091',
  indigo: '#4b0082',
  magenta: '#ff00ff',
  tan: '#d2b48c',
  violet: '#ee82ee',
  mint: '#98ff98',
};

const getColorStyle = (colorName = '') => {
  const normalized = colorName.toLowerCase().trim();
  if (colorMap[normalized]) return colorMap[normalized];
  if (normalized.startsWith('#')) return normalized;
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (colorMap[word]) return colorMap[word];
  }
  return normalized;
};

const renderStars = (rating) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-white' : 'text-gray-600'}`}>★</span>
    ))}
  </div>
);

function Products() {
  const { name } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data, loading } = useFetch('/admin/public/products');
  const allProducts = data || [];

  const product = allProducts.find(p =>
    String(p.id) === String(name) ||
    p.name.toLowerCase().replace(/\s+/g, '-') === name
  ) || null;

  const relatedProducts = product
    ? allProducts
        .filter(p => p.id !== product.id)
        .sort((a, b) => {
          const aSame = a.category?.toLowerCase().trim() === product.category?.toLowerCase().trim();
          const bSame = b.category?.toLowerCase().trim() === product.category?.toLowerCase().trim();
          if (aSame && !bSame) return -1;
          if (!aSame && bSame) return 1;
          return 0;
        })
        .slice(0, 4)
    : [];

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize((product.sizes?.length > 0 ? product.sizes : FALLBACK_SIZES)[0] || '');
      setCurrentImageIndex(0);
    }
  }, [product]);

  // update images when color changes
  const getImagesForColor = (color) => {
    if (!product) return [];
    const colorImages = product.color_images || {};
    if (color && colorImages[color]) {
      return [1, 2, 3]
        .map(n => colorImages[color][`image${n}`])
        .filter(Boolean);
    }
    const fallbackImage = getProductImage(product);
    return fallbackImage ? [fallbackImage] : [];
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const navigate = useNavigate();

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.error("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    const images = getImagesForColor(selectedColor);
    const currentPrice = (product.size_prices && product.size_prices[selectedSize]) ? product.size_prices[selectedSize] : product.price;
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: images[0] || getProductImage(product)
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.error("Please login to buy items.");
      navigate('/login');
      return;
    }
    const images = getImagesForColor(selectedColor);
    const currentPrice = (product.size_prices && product.size_prices[selectedSize]) ? product.size_prices[selectedSize] : product.price;
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: images[0] || getProductImage(product)
    });
    navigate('/checkout');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-white text-xl">Product not found</p>
      <Link to="/" className="text-gray-400 hover:text-white underline">← Back to Home</Link>
    </div>
  );

  const isWishlisted = isInWishlist(product.id);
  const images = getImagesForColor(selectedColor);
  const currentImage = images[currentImageIndex] || getProductImage(product) || '';
  const sizes = product.sizes?.length > 0 ? product.sizes : FALLBACK_SIZES;
  const colors = product.colors || [];
  const features = product.features || [];
  const currentPrice = (product.size_prices && product.size_prices[selectedSize]) ? product.size_prices[selectedSize] : product.price;
  const discount = product.original_price && product.original_price > currentPrice
    ? Math.round(((product.original_price - currentPrice) / product.original_price) * 100)
    : 0;

  return (
    <div className="bg-black min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/${product.category}`} className="hover:text-white transition-colors capitalize">{product.category}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-white">{product.name}</span>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">

          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 h-96 md:h-[580px] cursor-zoom-in"
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              onMouseEnter={() => !isMobile && setZoomLevel(1.5)}
              onMouseLeave={() => !isMobile && setZoomLevel(1)}
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: !isMobile ? `${mousePos.x}% ${mousePos.y}%` : 'center'
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}

              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  -{discount}% OFF
                </div>
              )}
              {product.stock > 0 && product.stock < 10 && (
                <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  Only {product.stock} left!
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-white' : 'border-gray-700 hover:border-gray-500'
                    }`}>
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}

            {!isMobile && <p className="text-center text-gray-600 text-xs">Hover image to zoom</p>}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{product.name}</h1>
                <p className="text-gray-500 text-sm capitalize">{product.category}</p>
              </div>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4">
              {renderStars(4.5)}
              <span className="text-gray-400 text-sm">4.5</span>
              <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-white">₹{currentPrice}</span>
              {product.original_price && product.original_price > currentPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.original_price}</span>
                  <span className="text-green-400 text-sm font-bold">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-300 leading-relaxed border-b border-gray-700 pb-5">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Color: <span className="text-gray-400 font-normal">{selectedColor}</span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {colors.map(color => {
                    const bgStyle = getColorStyle(color);
                    const isBlackColor = bgStyle.toLowerCase() === '#000000' || bgStyle.toLowerCase() === 'black' || bgStyle.toLowerCase() === '#0c0c0e';
                    const isWhiteColor = bgStyle.toLowerCase() === '#ffffff' || bgStyle.toLowerCase() === 'white' || bgStyle.toLowerCase() === 'cream' || bgStyle.toLowerCase() === '#fffdd0';
                    return (
                      <button 
                        key={color} 
                        onClick={() => handleColorChange(color)}
                        title={color}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-200 relative ${
                          selectedColor === color
                            ? 'border-[#d4af37] scale-110 shadow-lg'
                            : 'border-transparent hover:border-gray-500 hover:scale-105'
                        }`}
                        style={{ backgroundColor: bgStyle }}
                        aria-label={color}
                      >
                        {isBlackColor && (
                          <span className="absolute inset-0 rounded-full border border-gray-800" />
                        )}
                        {isWhiteColor && (
                          <span className="absolute inset-0 rounded-full border border-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">
                Size: <span className="text-gray-400 font-normal">{selectedSize}</span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-white text-black border-2 border-white'
                        : 'bg-gray-800 text-white border-2 border-gray-700 hover:border-white'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-700 bg-gray-800 text-white rounded-lg font-bold hover:border-white transition-colors">
                  −
                </button>
                <span className="text-2xl font-bold text-white w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-10 h-10 border-2 border-gray-700 bg-gray-800 text-white rounded-lg font-bold hover:border-white transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                    product.stock === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-black hover:bg-gray-100 hover:-translate-y-1 shadow-lg'
                  }`}>
                  {product.stock === 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Bag' : '👜 Add to Bag'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                    product.stock === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-[#d4af37] text-black hover:bg-[#b5952f] hover:-translate-y-1 shadow-lg'
                  }`}>
                  Buy Now
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 rounded-lg font-bold text-md border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-700 text-white hover:border-gray-500 hover:text-white'
                }`}>
                <span className="text-xl">{isWishlisted ? '❤️' : '🤍'}</span>
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-bold text-white mb-3">Product Features</h3>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-white mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300"><span>🚚</span><span>Free shipping on orders over ₹999</span></div>
              <div className="flex items-center gap-3 text-sm text-gray-300"><span>↩️</span><span>30-day hassle-free returns</span></div>
              <div className="flex items-center gap-3 text-sm text-gray-300"><span>🔒</span><span>Secure checkout</span></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-800 pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">People Also Bought</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => {
                const relDiscount = p.original_price && p.original_price > p.price
                  ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
                return (
                  <Link key={p.id} to={`/product/${p.id}`} className="no-underline text-white group block">
                    <div className="bg-[#0c0c0e] rounded-2xl overflow-hidden border border-gray-900 hover:border-gray-800 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative flex flex-col h-full transform hover:-translate-y-1">
                      <div className="aspect-[3/4] overflow-hidden bg-gray-950 relative">
                        <img
                          src={getProductImage(p) || ''}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.target.style.display = 'none'; }}
                          loading="lazy"
                        />
                        {relDiscount > 0 && (
                          <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">
                            -{relDiscount}%
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between bg-[#0c0c0e]">
                        <div>
                          <p className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase mb-1">{p.category || 'NYF TOTH'}</p>
                          <p className="font-semibold text-sm line-clamp-2 min-h-[40px] text-gray-200 group-hover:text-[#d4af37] transition-colors duration-300">{p.name}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-900">
                          <div className="flex items-baseline gap-2">
                            <span className="text-white font-bold text-base">₹{p.price}</span>
                            {p.original_price && p.original_price > p.price && (
                              <span className="text-gray-500 text-xs line-through">₹{p.original_price}</span>
                            )}
                          </div>
                          <span className="text-[#d4af37] text-xs font-semibold group-hover:underline">Explore →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default Products;

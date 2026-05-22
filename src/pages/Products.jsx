/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

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
  const { data, loading } = useFetch('/admin/public/products');
  const allProducts = data || [];

  const product = allProducts.find(p =>
    String(p.id) === String(name) ||
    p.name.toLowerCase().replace(/\s+/g, '-') === name
  ) || null;

  const relatedProducts = product
    ? allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
    : [];

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
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

  const handleAddToCart = () => {
    const images = getImagesForColor(selectedColor);
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: images[0] || getProductImage(product)
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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

  const images = getImagesForColor(selectedColor);
  const currentImage = images[currentImageIndex] || getProductImage(product) || '';
  const sizes = product.sizes?.length > 0 ? product.sizes : FALLBACK_SIZES;
  const colors = product.colors || [];
  const features = product.features || [];
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
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
            {/* Title & Wishlist */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{product.name}</h1>
                <p className="text-gray-500 text-sm capitalize">{product.category}</p>
              </div>
              <button onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-3xl transition-transform hover:scale-125 ml-4 flex-shrink-0">
                {isWishlisted ? '❤️' : '🤍'}
              </button>
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
              <span className="text-4xl font-bold text-white">₹{product.price}</span>
              {product.original_price && product.original_price > product.price && (
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
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button key={color} onClick={() => handleColorChange(color)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-white text-black border-2 border-white'
                          : 'bg-gray-800 text-white border-2 border-gray-700 hover:border-white'
                      }`}>
                      {color}
                    </button>
                  ))}
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

            {/* Add to Cart */}
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
            <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => {
                const relDiscount = p.original_price && p.original_price > p.price
                  ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
                return (
                  <Link key={p.id} to={`/product/${p.id}`} className="no-underline text-white group">
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-white transition-all duration-300">
                      <div className="relative">
                        <img
                          src={getProductImage(p) || ''}
                          alt={p.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = 'none'; }}
                          loading="lazy"
                        />
                        {relDiscount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">
                            -{relDiscount}%
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-white text-sm font-bold">₹{p.price}</p>
                          {p.original_price && p.original_price > p.price && (
                            <p className="text-gray-500 text-xs line-through">₹{p.original_price}</p>
                          )}
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

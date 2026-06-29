import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const fallbackHeroImages = [
  { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&q=75&w=1600&h=800&fit=crop', title: 'Wear the CROWN . Live the LEGACY .', subtitle: 'Premium cotton tees for every occasion' },
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&q=75&w=1600&h=800&fit=crop', title: 'New Drops', subtitle: 'Explore NYF TOTH latest T-shirt designs' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&q=75&w=1600&h=800&fit=crop', title: 'Oversized Essentials', subtitle: 'Bold fits designed for statement style' },
];

const fallbackProductImage =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&q=75&w=600&h=760&fit=crop';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 1200,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  fade: true,
};

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block no-underline shrink-0 snap-start w-[280px] md:w-[310px] my-2">
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-xl relative flex flex-col h-full">
      <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
        <img
          src={getProductImage(product) || fallbackProductImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = fallbackProductImage;
          }}
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-[#0c0c0e] text-[#fbfbfc] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          {product.category || 'NYF TOTH'}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3 className="text-base font-medium text-[#0c0c0e] leading-snug group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-2 min-h-[44px]">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed font-light">
              {product.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-lg font-bold text-[#0c0c0e]">₹{product.price}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] group-hover:underline flex items-center gap-1">
            Explore fit <span>→</span>
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const NewArrivalCard = ({ product }) => {
  const imageUrl = getProductImage(product) || fallbackProductImage;

  return (
    <Link to={`/product/${product.id}`} className="group block no-underline">
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(12,12,14,0.08)] relative flex flex-col h-full transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = fallbackProductImage;
            }}
            loading="lazy"
          />
          {/* Badge */}
          <div className="absolute top-4 left-4 bg-[#0c0c0e] text-[#d4af37] text-[9px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
            NEW IN
          </div>

          {/* Hover Quick View Overlay */}
          <div className="absolute inset-0 bg-[#0c0c0e]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="bg-white text-[#0c0c0e] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#d4af37] hover:text-[#0c0c0e]">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col flex-grow justify-between bg-white">
          <div>
            <span className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase block mb-1.5">
              {product.category || 'NYF TOTH'}
            </span>
            <h3 className="text-base font-semibold text-[#0c0c0e] leading-snug group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-2 min-h-[44px]">
              {product.name}
            </h3>
            {/* Elegant Stars Rating */}
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-yellow-500 font-bold">★★★★★</span>
              <span className="text-[10px] text-gray-400 font-light mt-0.5">(5.0)</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-light uppercase tracking-wider">Price</span>
              <span className="text-lg font-bold text-[#0c0c0e]">₹{product.price}</span>
            </div>
            <span className="w-10 h-10 rounded-full bg-[#0c0c0e] text-[#fbfbfc] group-hover:bg-[#d4af37] group-hover:text-[#0c0c0e] transition-colors duration-300 flex items-center justify-center shadow-sm">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryBanner = ({ title, subtitle, bgImage, linkTo }) => (
  <div className="relative rounded-3xl overflow-hidden h-[240px] md:h-[300px] mb-8 shadow-sm">
    <img src={bgImage} alt={title} className="w-full h-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/80 via-[#0c0c0e]/30 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-2">NYF TOTH COLLECTION</span>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-sm md:text-base text-gray-200 max-w-md font-medium mb-5">{subtitle}</p>
      <Link to={linkTo} className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-filter backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#0c0c0e] transition-all duration-300 w-fit">
        View All
      </Link>
    </div>
  </div>
);

const ProductScroller = ({ items, emptyText }) => (
  <div className="relative">
    {items.length === 0 ? (
      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center text-sm font-medium text-gray-500">
        {emptyText}
      </div>
    ) : (
      <>
        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory overflow-y-hidden scrollbar-none px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="w-24 h-[2px] bg-[#d4af37]/30 mx-auto rounded-full mt-2">
          <div className="w-12 h-full bg-[#d4af37] rounded-full animate-pulse" />
        </div>
      </>
    )}
  </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-150 py-5 transition-all duration-300">
    <button
      className="flex justify-between items-center w-full text-left font-medium text-[#0c0c0e] hover:text-[#d4af37] transition-colors focus:outline-none"
      onClick={onClick}
    >
      <span className="text-base md:text-lg font-medium">{question}</span>
      <span className={`text-lg transition-transform duration-300 text-[#d4af37] ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[200px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
      <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
        {answer}
      </p>
    </div>
  </div>
);

const Home = () => {
  const { data: banners = [], loading: bannersLoading } = useFetch('/admin/public/banners');
  const { data: dbProducts = [], loading: productsLoading } = useFetch('/admin/public/products');
  const loading = bannersLoading || productsLoading;

  const [faqOpen, setFaqOpen] = useState(null);

  const products = Array.isArray(dbProducts) ? dbProducts : [];

  // Filter products by category accurately
  const tshirtProducts = products.filter(p => {
    const val = `${p.category || ''} ${p.name || ''}`.toLowerCase();
    return val.includes('tshirt') || val.includes('t-shirt') || val.includes('tee') || p.category?.toLowerCase() === 'tshirts';
  });

  const maleTshirtProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    if (pCat === 'male-tshirts') return true;
    if (pCat === 'female-tshirts' || pCat === 'oversized-tshirts') return false;

    // Fallback for legacy / seed products
    const val = `${p.category || ''} ${p.name || ''} ${p.subcategory || ''}`.toLowerCase();
    const isTshirt = val.includes('tshirt') || val.includes('t-shirt') || val.includes('tee') || pCat === 'tshirts';
    const isMale = (val.includes('male') && !val.includes('female')) ||
      (val.includes('men') && !val.includes('women')) ||
      (val.includes('man') && !val.includes('woman'));
    return isTshirt && isMale;
  });

  const femaleTshirtProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    if (pCat === 'female-tshirts') return true;
    if (pCat === 'male-tshirts' || pCat === 'oversized-tshirts') return false;

    // Fallback for legacy / seed products
    const val = `${p.category || ''} ${p.name || ''} ${p.subcategory || ''}`.toLowerCase();
    const isTshirt = val.includes('tshirt') || val.includes('t-shirt') || val.includes('tee') || pCat === 'tshirts';
    const isFemale = val.includes('female') || val.includes('women') || val.includes('woman') || val.includes('ladies');
    return isTshirt && isFemale;
  });

  const oversizedTshirtProducts = products.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    if (pCat === 'oversized-tshirts') return true;
    if (pCat === 'male-tshirts' || pCat === 'female-tshirts') return false;

    // Fallback for legacy / seed products
    const val = `${p.category || ''} ${p.name || ''} ${p.subcategory || ''}`.toLowerCase();
    const isTshirt = val.includes('tshirt') || val.includes('t-shirt') || val.includes('tee') || pCat === 'tshirts';
    const isOversized = val.includes('oversized');
    return isTshirt && isOversized;
  });

  const newArrivals = products.slice().reverse().slice(0, 8);

  const heroBanners = banners.length > 0
    ? banners.map((b) => ({ url: b.image_url, title: b.title || 'Exclusive Drops', subtitle: b.description || 'Elevate your dressing signature' }))
    : fallbackHeroImages;

  const faqs = [
    {
      question: 'How do I care for my NYF TOTH T-shirts?',
      answer: 'We recommend machine washing inside-out in cold water on a gentle cycle. Hang dry to maintain the fit and fabric quality.'
    },
    {
      question: 'What sizes do you offer?',
      answer: 'We offer sizes from S to 3XL across our Male, Female, and Oversized collections. Check the size guide on each product page.'
    },
    {
      question: 'What is NYF TOTH\'s sizing like?',
      answer: 'Our regular fits are true to size. Oversized T-shirts run 2-3 sizes larger for a relaxed, boxy silhouette.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Orders are dispatched within 2-3 business days. You will receive tracking details via email and WhatsApp.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#fbfbfc]">
      {/* 1. Main Hero Slider Banner */}
      <section className="relative overflow-hidden bg-[#0c0c0e]">
        {loading ? (
          <div className="flex h-[560px] md:h-[680px] items-center justify-center bg-[#0c0c0e] text-lg font-medium text-white/50 animate-pulse">
            Curating exquisite collection...
          </div>
        ) : (
          <div className="relative">
            <Slider {...sliderSettings}>
              {heroBanners.map((slide, index) => (
                <div key={index} className="relative h-[560px] md:h-[680px] outline-none">
                  <img
                    src={slide.url}
                    alt={slide.title}
                    className="h-full w-full object-cover opacity-85"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-8 md:px-16 flex justify-start">
                      <div className="max-w-2xl text-left">
                        <span className="inline-flex rounded-full bg-[#d4af37] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0c0c0e] mb-5">
                          NEW DROP
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-none mb-6">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed max-w-lg mb-8">
                          {slide.subtitle}
                        </p>
                        <div className="flex gap-4">
                          <Link to="/tshirts" className="bg-[#d4af37] text-[#0c0c0e] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#f3d778] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
                            SHOP COLLECTION
                          </Link>
                          <Link to="/custom" className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#0c0c0e] transition-all duration-300 transform hover:-translate-y-0.5">
                            VIEW LOOKBOOK
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </section>

      {/* Browse by Category Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            SHOP THE COLLECTION
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0c0c0e] tracking-tight">
            Browse by Category
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto">
            Explore our curated collections designed for distinct cuts, styling signatures, and premium comfort.
          </p>
          <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Card 1: Oversized */}
          <Link to="/tshirts?category=oversized" className="group relative block overflow-hidden rounded-3xl aspect-[3/4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(12,12,14,0.15)] transition-all duration-500 transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600&h=800"
              alt="Oversized Tees"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/30 to-transparent transition-opacity duration-300 group-hover:via-[#0c0c0e]/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div>
                <span className="bg-[#d4af37] text-[#0c0c0e] text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
                  Most Popular
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">NYF</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1">Oversized Tees</h3>
                <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">12 STYLES</p>
              </div>
            </div>
          </Link>

          {/* Card 2: Male */}
          <Link to="/tshirts?category=male" className="group relative block overflow-hidden rounded-3xl aspect-[3/4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(12,12,14,0.15)] transition-all duration-500 transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600&h=800"
              alt="Male T-Shirts"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/30 to-transparent transition-opacity duration-300 group-hover:via-[#0c0c0e]/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div>
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-[#fbfbfc] text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
                  For Him
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">NYF</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1">Male T-Shirts</h3>
                <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">8 STYLES</p>
              </div>
            </div>
          </Link>

          {/* Card 3: Female */}
          <Link to="/tshirts?category=female" className="group relative block overflow-hidden rounded-3xl aspect-[3/4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(12,12,14,0.15)] transition-all duration-500 transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=600&h=800"
              alt="Female T-Shirts"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/30 to-transparent transition-opacity duration-300 group-hover:via-[#0c0c0e]/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div>
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-[#fbfbfc] text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
                  For Her
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">NYF</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1">Female T-Shirts</h3>
                <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">6 STYLES</p>
              </div>
            </div>
          </Link>

          {/* Card 4: Coordinate Sets */}
          <Link to="/tshirts?category=coordinate" className="group relative block overflow-hidden rounded-3xl aspect-[3/4] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(12,12,14,0.15)] transition-all duration-500 transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&h=800"
              alt="Coordinate Sets"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/30 to-transparent transition-opacity duration-300 group-hover:via-[#0c0c0e]/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div>
                <span className="bg-[#d4af37] text-[#0c0c0e] text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
                  Bundle & Save
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase block mb-1">NYF</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1">Coordinate Sets</h3>
                <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">4 SETS</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Brand Aesthetic Statement */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4">NYF TOTH</p>
          <p className="text-2xl md:text-4xl text-[#0c0c0e] font-light leading-relaxed font-serif italic">
            "Royalty Meets Eternity"
          </p>
          <p className="text-base text-gray-500 font-light leading-relaxed max-w-2xl mx-auto mt-4">
            Premium quality garments designed for high-end streetwear. Crafted with heavyweight premium cotton, minimalist tailoring, and bold street-ready silhouettes.
          </p>
        </div>
      </section>

      {/* New Arrivals Section with Greater UI */}
      <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            THE LATEST DROPS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0c0c0e] tracking-tight">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto">
            Fresh styles added to our collections. Handpicked materials tailored for statement fits.
          </p>
          <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        {newArrivals.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center text-sm font-medium text-gray-500 max-w-xl mx-auto shadow-sm">
            Our atelier is currently organizing the latest collection...
          </div>
        ) : (
          <div className="flex gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 scroll-smooth snap-x snap-mandatory scrollbar-none px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {newArrivals.map((product) => (
              <div key={product.id} className="w-[280px] sm:w-[310px] md:w-auto shrink-0 snap-start">
                <NewArrivalCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Categories & rails */}
      <section className="max-w-7xl mx-auto px-8 pb-16 md:pb-24 border-t border-gray-100 pt-16 md:pt-24">

        {/* Male T-Shirts Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Male T-Shirts"
            subtitle="Classic and modern fits crafted for men with premium heavy cotton."
            bgImage="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&fit=crop"
            linkTo="/tshirts?category=male"
          />
          <ProductScroller items={maleTshirtProducts} emptyText="No Male T-Shirts are available from the backend yet." />
        </div>

        {/* Female T-Shirts Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Female T-Shirts"
            subtitle="Elegant and trendy tees designed for women with soft premium fabrics."
            bgImage="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&fit=crop"
            linkTo="/tshirts?category=female"
          />
          <ProductScroller items={femaleTshirtProducts} emptyText="No Female T-Shirts are available from the backend yet." />
        </div>

        {/* Oversized T-Shirts Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Oversized T-Shirts"
            subtitle="Bold, boxy, drop-shoulder fits for the ultimate street statement."
            bgImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&fit=crop"
            linkTo="/tshirts?category=oversized"
          />
          <ProductScroller items={oversizedTshirtProducts} emptyText="No Oversized T-Shirts are available from the backend yet." />
        </div>

      </section>

      {/* 10. Frequently Asked Questions (FAQs) */}
      <section className="bg-white border-t border-gray-100 py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">SUPPORT & ASSISTANCE</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0c0c0e]">FAQs</h2>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-3">Everything you need to know about our luxury fitting drops.</p>
          </div>
          <div className="bg-[#fbfbfc] rounded-3xl p-6 md:p-10 border border-gray-100">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.question}
                answer={faq.answer}
                isOpen={faqOpen === idx}
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

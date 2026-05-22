import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const fallbackHeroImages = [
  { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&q=75&w=1600&h=800&fit=crop', title: 'Summer Essentials', subtitle: 'Exquisite linen fabrics & clean aesthetics' },
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&q=75&w=1600&h=800&fit=crop', title: 'Tailored Luxury', subtitle: 'Experience Lovito premium apparel drops' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&q=75&w=1600&h=800&fit=crop', title: 'Street Elegance', subtitle: 'Curated styling guides designed for you' },
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
          {product.category || 'Lovito Premium'}
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

const CategoryBanner = ({ title, subtitle, bgImage, linkTo }) => (
  <div className="relative rounded-3xl overflow-hidden h-[240px] md:h-[300px] mb-8 shadow-sm">
    <img src={bgImage} alt={title} className="w-full h-full object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e]/80 via-[#0c0c0e]/30 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-2">LOVITO COLLECTION</span>
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

  const shirtProducts = products.filter(p => {
    const val = `${p.category || ''} ${p.name || ''}`.toLowerCase();
    return (val.includes('shirt') && !val.includes('tshirt') && !val.includes('t-shirt') && !val.includes('sweatshirt')) || p.category?.toLowerCase() === 'shirts';
  });

  const trackpantProducts = products.filter(p => {
    const val = `${p.category || ''} ${p.name || ''}`.toLowerCase();
    return val.includes('track') || p.category?.toLowerCase() === 'track pants' || p.category?.toLowerCase() === 'trackpants';
  });

  const pantProducts = products.filter(p => {
    const val = `${p.category || ''} ${p.name || ''}`.toLowerCase();
    return (val.includes('pant') && !val.includes('track')) || p.category?.toLowerCase() === 'pants';
  });

  const heroBanners = banners.length > 0 
    ? banners.map((b) => ({ url: b.image_url, title: b.title || 'Exclusive Drops', subtitle: b.description || 'Elevate your dressing signature' }))
    : fallbackHeroImages;

  const faqs = [
    {
      question: 'How do I care for my premium Lovito pieces?',
      answer: 'For premium garments, we recommend machine washing in cold water inside-out on a gentle cycle, or dry cleaning. Hang dry to maintain fit structure and luxury soft hand-feel.'
    },
    {
      question: 'Can I request personal styling with Chinna?',
      answer: 'Yes! Navigate to our "Dress Up with Chinna" tab to access bespoke styled coordinates. You can explore custom styling options matching your silhouettes.'
    },
    {
      question: 'What is Lovito\'s sizing fit like?',
      answer: 'Our fits run relaxed/boxy reflecting contemporary streetwear standards. We suggest choosing your normal size for a draped aesthetic, or sizing down for a closer fit.'
    },
    {
      question: 'How long does shipment dispatch take?',
      answer: 'Orders are processed immediately and dispatch within 2-3 business days. Delivery details and secure tracking IDs will be forwarded to your registered email.'
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
                          LUXURY DROP
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-none mb-6">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed max-w-lg mb-8">
                          {slide.subtitle}
                        </p>
                        <div className="flex gap-4">
                          <Link to="/tshirts" className="bg-[#d4af37] text-[#0c0c0e] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#f3d778] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
                            Shop Summer T-Shirts
                          </Link>
                          <Link to="/custom" className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#0c0c0e] transition-all duration-300 transform hover:-translate-y-0.5">
                            Dress Up with Chinna
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

      {/* Brand Aesthetic Statement */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4">LOVITO ATELIER</p>
          <p className="text-xl md:text-3xl text-[#0c0c0e] font-light leading-relaxed">
            Beautifully crafted basics designed to celebrate relaxed structures, heavy knit silhouettes, and clean premium aesthetics.
          </p>
        </div>
      </section>

      {/* Main Categories & rails */}
      <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
        
        {/* 2 & 3. T-Shirts Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="T-Shirts Series"
            subtitle="Boxy heavy cotton tees tailored with subtle textures and luxury dropped-shoulder fitting."
            bgImage="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&fit=crop"
            linkTo="/tshirts"
          />
          <ProductScroller items={tshirtProducts} emptyText="No T-Shirts are available from the backend yet." />
        </div>

        {/* 4 & 5. Shirts Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Resort & Oxford Shirts"
            subtitle="Tailored structures, clean button-down collars, and lightweight resort-ready styling layers."
            bgImage="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&fit=crop"
            linkTo="/shirts"
          />
          <ProductScroller items={shirtProducts} emptyText="No Shirts are available from the backend yet." />
        </div>

        {/* 6 & 7. Track Pants Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Heavyweight Track Pants"
            subtitle="Premium athletic structures designed with custom drawstrings, heavy elastic cuffs, and plush comfort."
            bgImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&fit=crop"
            linkTo="/trackpants"
          />
          <ProductScroller items={trackpantProducts} emptyText="No Track Pants are available from the backend yet." />
        </div>

        {/* 8 & 9. Pants Banner & Rail */}
        <div className="mb-20">
          <CategoryBanner
            title="Tailored Trouser Pants"
            subtitle="Minimal pleats, structured cotton-twill chinos, and soft linen drapes built to fit elegantly."
            bgImage="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&fit=crop"
            linkTo="/pants"
          />
          <ProductScroller items={pantProducts} emptyText="No Pants are available from the backend yet." />
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const fallbackProductImage =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=760&fit=crop';

const categoryGuides = {
  'male-tshirts': {
    title: 'Male T-Shirts',
    subtitle: 'Classic and modern fits crafted for men with premium heavy cotton.',
    steps: [
      {
        number: '01',
        title: 'Choose the Silhouette',
        description: 'Pick a classic or modern fit drop-shoulder NYF TOTH tee. The heavy fabric structure keeps the drape alive rather than clinging.'
      },
      {
        number: '02',
        title: 'Shoulder Alignment',
        description: 'Align the shoulder seams with your natural drop line to achieve a clean streetwear aesthetic without looking sloppy.'
      },
      {
        number: '03',
        title: 'Contrast Layering',
        description: 'Layer under a light jacket or open denim shirt. Let the neckline frame clean and lay flat.'
      },
      {
        number: '04',
        title: 'Bottom Proportions',
        description: 'Pair with straight-leg trousers, relaxed cargos, or utility shorts for a balanced street-ready silhouette.'
      }
    ],
    tip: "Harsha valeti says: 'A clean fit on the shoulder and chest is key. Pair with relaxed denim to complete the statement.'"
  },
  'oversized-tshirts': {
    title: 'Oversized T-Shirts',
    subtitle: 'The art of street-ready silhouette balance using thick, premium knit oversized tees.',
    steps: [
      {
        number: '01',
        title: 'Go True to Size',
        description: 'No need to size up. Our oversized fits are pre-designed with a generous boxy cut and dropped shoulders.'
      },
      {
        number: '02',
        title: 'Collar Placement',
        description: 'Ensure the mock neck fits snug against your neck. The collar should sit clean without sagging.'
      },
      {
        number: '03',
        title: 'Drape & Fall',
        description: 'Let the heavy 240+ GSM fabric hang naturally. The weight ensures it keeps its structured boxy profile.'
      },
      {
        number: '04',
        title: 'Style Coordination',
        description: 'Coordinate with relaxed joggers or baggy cargos. Balance the upper volume with straight or wider cuts below.'
      }
    ],
    tip: "Harsha valeti says: 'Keep your bottom pieces relaxed when wearing oversized tees. Wide-leg fits elevate the look perfectly.'"
  }
};

const CustomEmbroidery = () => {
  const { data: dbProducts = [], loading } = useFetch('/admin/public/products');
  const [activeTab, setActiveTab] = useState('male-tshirts');

  const products = Array.isArray(dbProducts) ? dbProducts : [];

  // Filter products by active tab category
  const filteredProducts = products.filter(product => {
    return (product.category || '').toLowerCase() === activeTab;
  }).slice(0, 4); // Show top 4 styled suggestions

  const currentGuide = categoryGuides[activeTab] || categoryGuides['male-tshirts'];

  return (
    <div className="bg-[#fbfbfc] min-h-screen">
      {/* Premium Elegant Banner */}
      <section className="relative h-[320px] md:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&fit=crop"
          alt="Dress up with Harsha valeti"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-8 pb-10 md:pb-16 text-white">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">NYF TOTH ATELIER</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Dress Up with Harsha valeti</h1>
          <p className="text-sm md:text-lg text-gray-200 max-w-2xl font-light leading-relaxed">
            Your personal masterclass in modern styling. Explore step-by-step dressing processes designed by Harsha valeti to bring out the luxurious structure in every garment.
          </p>
        </div>
      </section>

      {/* Main interactive area */}
      <section className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 border-b border-gray-150 pb-6">
          {[
            { id: 'male-tshirts', label: 'Male T-Shirts 👕' },
            { id: 'oversized-tshirts', label: 'Oversized T-Shirts 👕' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#0c0c0e] text-[#fbfbfc] shadow-lg scale-105'
                  : 'bg-white text-[#4a4a52] border border-gray-200 hover:border-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wear Process Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-24">
          
          {/* Left / Center Column: Step-by-Step cards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] block mb-1">STYLING WORKFLOW</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0e]">{currentGuide.title} Process</h2>
              <p className="text-sm text-gray-500 font-medium mt-2">{currentGuide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#d4af37]/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full justify-between"
                >
                  <div>
                    <span className="text-2xl font-bold text-[#d4af37]/35 block mb-4 font-mono">{step.number}</span>
                    <h3 className="text-lg font-bold text-[#0c0c0e] mb-3">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Harsha valeti's Master Advice Box */}
          <div className="bg-[#0c0c0e] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl sticky top-28 mt-0 lg:mt-16">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className="text-base font-bold tracking-wider text-white">Harsha valeti's Master Advice</h4>
                  <p className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-widest">NYF TOTH Style Director</p>
                </div>
              </div>
              
              <blockquote className="text-base md:text-lg font-light italic leading-relaxed text-gray-200 mb-6">
                "{currentGuide.tip.match(/"([^"]+)"/)?.[1] || currentGuide.tip}"
              </blockquote>
              
              <div className="border-t border-white/10 pt-6">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every product is tailored with strict structural standards. Follow this workflow carefully to balance the physical fall of the fabric and complete your outfit successfully.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Shop the Look Section */}
        <div className="border-t border-gray-150 pt-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] block mb-2">COMPLETE THE outfit</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0c0c0e]">Shop Harsha valeti's Styled Pieces</h2>
            <p className="text-sm text-gray-500 font-medium mt-2">Pick the matching elements featured in this category styling guide.</p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400 font-medium">Curating styled items...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center text-sm font-medium text-gray-500">
              No backend products are available for this styling category yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block no-underline">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col justify-between">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                      <img
                        src={getProductImage(product) || fallbackProductImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = fallbackProductImage;
                        }}
                      />
                    </div>
                    <div className="p-4 bg-white flex flex-col flex-grow justify-between">
                      <h3 className="text-sm font-medium text-[#0c0c0e] leading-snug group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-2 min-h-[38px]">
                        {product.name}
                      </h3>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                        <span className="text-base font-bold text-[#0c0c0e]">₹{product.price}</span>
                        <span className="text-xs font-semibold text-[#d4af37] group-hover:underline">Buy Now →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default CustomEmbroidery;

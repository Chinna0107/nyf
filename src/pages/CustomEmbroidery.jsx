import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const fallbackProductImage =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=760&fit=crop';

const categoryGuides = {
  shirts: {
    title: 'Tailored & Resort Shirts',
    subtitle: 'Crafting clean, breathable, and structured layering with premium Lovito shirts.',
    steps: [
      {
        number: '01',
        title: 'Select the Base Layer',
        description: 'Begin with a lightweight, ultra-fine white rib-knit tank or undershirt. This keeps the silhouette smooth and manages moisture effectively under luxury fabrics.'
      },
      {
        number: '02',
        title: 'The Core Fit & Buttoning',
        description: 'Slip on the Lovito linen or cotton Oxford shirt. Button the shirt starting from the third button up for a relaxed, breathing neckline, or button completely for a crisp sartorial edge.'
      },
      {
        number: '03',
        title: 'The French Tuck & Sleeves',
        description: 'Execute a French tuck (tucking only the front hem softly into your waistband) to create an elegant leg line. Roll the cuffs exactly twice, keeping the fold crisp to rest midway up your forearm.'
      },
      {
        number: '04',
        title: 'Accessorize with Contrast',
        description: 'Finish with a thin brushed silver chain or vintage watch. Pair with leather loafers or minimalist clean trainers for a complete premium resort aesthetic.'
      }
    ],
    tip: "Chinna says: 'Always let linen drape naturally. Do not over-press it. The soft creases give off that effortless high-end character.'"
  },
  tshirts: {
    title: 'Heavyweight Boxy T-Shirts',
    subtitle: 'The art of street-ready silhouette balance using thick, premium knit cotton tees.',
    steps: [
      {
        number: '01',
        title: 'Choose the Silhouette',
        description: 'Pick an oversized, heavy-cotton drop-shoulder Lovito tee. The thick fabric structure keeps the boxy fit alive rather than clinging.'
      },
      {
        number: '02',
        title: 'Shoulder & Neckline Adjust',
        description: 'Pull the neck collar snug against the back of your neck. Let the drop-shoulder seam drape exactly 2-3 inches past your natural shoulder line.'
      },
      {
        number: '03',
        title: 'Layering Balance',
        description: 'To layer, drape an open linen resort shirt or a lightweight tailored zip-up hoodie over the tee. The necklines should stack cleanly without bunching.'
      },
      {
        number: '04',
        title: 'Pant Proportions',
        description: 'Pair with relaxed cargo pants or utility joggers. Let the hem of the t-shirt drape freely over the waistband for a clean street-smart contour.'
      }
    ],
    tip: "Chinna says: 'When rocking a heavy boxy tee, make sure your bottom half matches the volume. Avoid super skinny pants; go for relaxed or straight silhouettes.'"
  },
  trackpants: {
    title: 'Heavy Fleece Track Pants',
    subtitle: 'Elevating comfortable athletic wear into an elegant, daily high-fashion outfit.',
    steps: [
      {
        number: '01',
        title: 'Elastic & Waist Placement',
        description: 'Position the high-elastic waistband comfortably on your natural waist. Secure the luxury braided drawstrings with a neat, low-profile knot.'
      },
      {
        number: '02',
        title: 'Tee Coordination',
        description: 'Tuck in a slim or cropped fitted t-shirt to contrast the heavy, voluminous fleece fabric of the track pants. This defines your natural waistline.'
      },
      {
        number: '03',
        title: 'Sleeve Layering',
        description: 'Throw on a matching tailored luxury zip bomber or light utility windbreaker. Keep the jacket unzipped to showcase the contrasted fitted tee underneath.'
      },
      {
        number: '04',
        title: 'Sneaker Stack',
        description: 'Let the elastic cuffs of the joggers rest exactly above the ankle bone. Style with clean retro running sneakers or chunky high-top trainers.'
      }
    ],
    tip: "Chinna says: 'To keep track pants looking premium rather than lazy, add structured elements to the rest of the outfit—like a collared jacket or sharp metal accessories.'"
  },
  pants: {
    title: 'Tailored Chinos & Linen Pants',
    subtitle: 'Crisp lines, classic drapes, and sophisticated tucks for tailored daily elegance.',
    steps: [
      {
        number: '01',
        title: 'Structure and Crease Align',
        description: 'Slide into the cotton-twill chinos or pleated linen pants. Ensure the center pleats or ironed creases align straight down the center of your knees.'
      },
      {
        number: '02',
        title: 'Belt Selection',
        description: 'Slide a premium, 1-inch matte leather or brushed suede belt through the loops. Choose a buckle color (silver/gold) that matches your watch.'
      },
      {
        number: '03',
        title: 'Tuck & Blouse',
        description: 'Completely tuck in your collared knit polo or Oxford shirt. Raise your arms once to pull just enough fabric out to create a slight drape (blousing) over the belt.'
      },
      {
        number: '04',
        title: 'The Perfect Hem Break',
        description: 'Ensure the pant cuffs rest softly on the top of your shoes, creating a slight "no-break" or "half-break" crease. Pair with suede Chelsea boots or clean court shoes.'
      }
    ],
    tip: "Chinna says: 'Tailored pants look best when they skim the body without pulling. A clean draping line makes you look instantly taller and more polished.'"
  }
};

const CustomEmbroidery = () => {
  const { data: dbProducts = [], loading } = useFetch('/admin/public/products');
  const [activeTab, setActiveTab] = useState('shirts');

  const products = Array.isArray(dbProducts) ? dbProducts : [];

  // Filter products by active tab category
  const filteredProducts = products.filter(product => {
    const pCat = product.category?.toLowerCase() || '';
    if (activeTab === 'tshirts') {
      return pCat.includes('tshirt') || pCat.includes('t-shirt') || pCat.includes('tee') || pCat === 'tshirts';
    }
    if (activeTab === 'shirts') {
      return (pCat.includes('shirt') && !pCat.includes('tshirt') && !pCat.includes('t-shirt')) || pCat === 'shirts';
    }
    if (activeTab === 'trackpants') {
      return pCat.includes('track') || pCat.includes('jogger') || pCat === 'track pants';
    }
    if (activeTab === 'pants') {
      return (pCat.includes('pant') && !pCat.includes('track')) || pCat === 'pants';
    }
    return false;
  }).slice(0, 4); // Show top 4 styled suggestions

  const currentGuide = categoryGuides[activeTab] || categoryGuides.shirts;

  return (
    <div className="bg-[#fbfbfc] min-h-screen">
      {/* Premium Elegant Banner */}
      <section className="relative h-[320px] md:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&fit=crop"
          alt="Dress up with Chinna"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-8 pb-10 md:pb-16 text-white">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">LOVITO ATELIER</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Dress Up with Chinna</h1>
          <p className="text-sm md:text-lg text-gray-200 max-w-2xl font-light leading-relaxed">
            Your personal masterclass in modern styling. Explore step-by-step dressing processes designed by Chinna to bring out the luxurious structure in every garment.
          </p>
        </div>
      </section>

      {/* Main interactive area */}
      <section className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 border-b border-gray-150 pb-6">
          {[
            { id: 'shirts', label: 'Shirts 👔' },
            { id: 'tshirts', label: 'T-Shirts 👕' },
            { id: 'trackpants', label: 'Track Pants 🎽' },
            { id: 'pants', label: 'Pants 👖' }
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

          {/* Right Column: Chinna's Master Advice Box */}
          <div className="bg-[#0c0c0e] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl sticky top-28 mt-0 lg:mt-16">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className="text-base font-bold tracking-wider text-white">Chinna's Master Advice</h4>
                  <p className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-widest">Lovito Style Director</p>
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
            <h2 className="text-2xl md:text-4xl font-bold text-[#0c0c0e]">Shop Chinna's Styled Pieces</h2>
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

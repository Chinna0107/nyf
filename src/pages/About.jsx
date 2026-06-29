import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiCompass, FiShield, FiUsers } from 'react-icons/fi';

const About = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const values = [
    { icon: <FiAward className="text-[#d4af37] w-6 h-6" />, title: 'Quality Standards', description: 'Fine fabrics and flawless tailoring in every garment drop.' },
    { icon: <FiCompass className="text-[#d4af37] w-6 h-6" />, title: 'Creative Styling', description: 'Premium T-shirt designs crafted by Harsha Valeti for effortless style.' },
    { icon: <FiShield className="text-[#d4af37] w-6 h-6" />, title: 'Conscious Production', description: 'Small-batch manufacturing focusing on zero-waste and ethical standards.' },
    { icon: <FiUsers className="text-[#d4af37] w-6 h-6" />, title: 'NYF TOTH Community', description: 'Building a community of T-shirt enthusiasts who value quality and style.' }
  ];

  const team = [
    { name: 'Harsha Valeti', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&q=75&w=300&h=300&fit=crop&crop=faces' },
    // { name: 'Michael Chen', role: 'Head of Production', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&q=75&w=300&h=300&fit=crop&crop=faces' },
    // { name: 'Emma Davis', role: 'Customer Experience Lead', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&q=75&w=300&h=300&fit=crop&crop=faces' },
    // { name: 'James Wilson', role: 'Design Specialist', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&q=75&w=300&h=300&fit=crop&crop=faces' }
  ];

  return (
    <div className="bg-[#fbfbfc] min-h-screen text-[#0c0c0e]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-8 text-center bg-[#0c0c0e] overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&q=75&w=1600&fit=crop"
            alt="Atelier Banner"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0e]/80 via-[#0c0c0e]/60 to-[#0c0c0e]" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">NYF TOTH</span>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6">
            About NYF TOTH
          </h1>
          <p className="text-base md:text-xl text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Crafting premium T-shirts since 2026. We believe in quality fabrics, bold designs, and a vibrant community.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-12 items-center`}>
          <div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] block mb-2">OUR ORIGINS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c0c0e] mb-6">
              Our Story
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-4">
              NYF TOTH started as a passion for creating the perfect T-shirt. What began with a single design and a dream has grown into a thriving premium online T-shirt destination serving style-forward individuals worldwide.
            </p>
            <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed mb-4">
              We are dedicated to creating high-quality T-shirts that tell your story. Every piece is crafted with micro-attention to detail and a commitment to fabric excellence.
            </p>
            <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
              Today, under the creative direction of Harsha Valeti, we continue to expand our collections while maintaining the same premium standards that started it all.
            </p>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden min-h-[360px] shadow-lg group border border-gray-100 flex items-end">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&q=75&w=800&fit=crop"
              alt="Crafting Premium Garments"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-left z-10">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">ESTABLISHED 2026</span>
              {/* <h3 className="text-2xl font-bold mb-2">6+ Years of Tailoring</h3> */}
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Meticulous pattern making, high-density stitching, and premium finishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-100">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] block mb-2">NYF TOTH VALUES</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c0c0e]">Our Values</h2>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
          {values.map((value, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#d4af37]/35 shadow-sm hover:shadow-xl transition-all duration-300 flex gap-5 items-start">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shrink-0">
                {value.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0c0c0e] mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Widescreen Banner */}
      <section className="relative py-48 px-8 overflow-hidden my-12">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&q=75&w=1200&fit=crop"
          alt="Luxury Apparel Showcase"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">DESIGNED TO EXCELLENCE</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            "Simplicity is the keynote of all true elegance."
          </h2>
          <p className="text-sm md:text-base text-gray-300 font-light max-w-lg mx-auto leading-relaxed">
            Under Harsha Valeti's creative direction, we curate T-shirts that emphasize shape, material composition, and comfort.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="bg-white py-16 border-y border-gray-100">
        <div className={`max-w-7xl mx-auto px-8 grid ${isMobile ? 'grid-cols-2 gap-8' : 'grid-cols-4'} gap-6 text-center`}>
          {[
            { value: '10K+', desc: 'Sophisticated Customers' },
            { value: '50K+', desc: 'Garments Shipped' },
            { value: '98%', desc: 'Satisfaction Rating' },
            { value: '24/7', desc: 'Atelier Concierge' }
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl md:text-4xl font-bold text-[#0c0c0e] mb-1">{stat.value}</div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] block mb-2">THE CREATIVE MINDS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c0c0e]">Meet Our Team</h2>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-6' : 'grid-cols-4'} gap-6`}>
          {team.map((member, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm group hover:shadow-md transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border border-gray-100 group-hover:border-[#d4af37] transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-base font-bold text-[#0c0c0e] mb-1">{member.name}</h3>
              <p className="text-xs text-gray-400 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-20 text-center border-t border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0e] mb-4">
          Ready to Elevate Your Fit?
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-light mb-8 max-w-md mx-auto">
          Explore our latest T-shirt collections for men, women, and oversized fits.
        </p>
        <Link to="/tshirts">
          <button className="px-8 py-3.5 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-full text-sm hover:shadow-lg transition-all duration-300">
            Shop NYF TOTH Now
          </button>
        </Link>
      </section>
    </div>
  );
};

export default About;


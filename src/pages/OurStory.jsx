import React from 'react';

const OurStory = () => {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="bg-white text-black py-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-200 rounded-full opacity-10 -ml-48 -mt-48"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-lg md:text-xl text-gray-700">Crafting Quality, Creating Memories</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-gray-900 p-8 md:p-12 rounded-xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Who We Are</h2>
          <p className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg">
            Welcome to NYF TOTH - your premium destination for quality T-shirts. Founded by Harsha Valeti, we started with a simple vision: to create high-quality T-shirts for men, women, and oversized fits that make a statement.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg">
            What began as a small passion project has grown into a thriving business serving thousands of satisfied customers. We believe that a great T-shirt is more than just fabric - it's a form of self-expression, a way to celebrate individuality, and a means to create lasting impressions.
          </p>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            Today, we continue to innovate and push the boundaries of what's possible in premium T-shirts, always keeping our customers at the heart of everything we do.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-gray-900 p-8 md:p-12 rounded-xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg">
            Our mission is to provide premium quality T-shirts that exceed expectations. We are committed to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Delivering exceptional craftsmanship in every T-shirt',
              'Using only the finest heavy cotton and sustainable practices',
              'Offering premium T-shirts for male, female, and oversized fits',
              'Creating products that bring joy and pride to our customers',
              'Building a community of satisfied, loyal customers',
              'Innovating and improving continuously'
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg border-l-4 border-white text-gray-300 text-sm md:text-base">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: '🎨', title: 'Creativity', desc: 'We embrace innovation and creative thinking in every design we create.' },
            { icon: '⭐', title: 'Quality', desc: 'Excellence is not an act but a habit. We maintain the highest standards.' },
            { icon: '❤️', title: 'Customer Care', desc: 'Your satisfaction is our priority. We listen and respond to your needs.' },
            { icon: '🌱', title: 'Sustainability', desc: 'We care about our planet and use eco-friendly materials whenever possible.' },
            { icon: '🤝', title: 'Integrity', desc: 'We conduct business with honesty, transparency, and ethical practices.' },
            { icon: '🚀', title: 'Innovation', desc: 'We constantly evolve and improve to serve you better.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center hover:border-white transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-gray-900 p-8 md:p-12 rounded-xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Passionate Team</h2>
          <p className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg">
            Behind every NYF TOTH T-shirt is a dedicated team of skilled designers and customer service professionals. Our team is passionate about what we do and committed to bringing your vision to life.
          </p>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            With years of combined experience in premium T-shirt design, fashion, and customer service, we take pride in delivering products that exceed expectations and create lasting relationships with our customers. Every team member shares our commitment to excellence and customer satisfaction.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { number: '5000+', label: 'Happy Customers' },
            { number: '10000+', label: 'Products Delivered' },
            { number: '50+', label: 'Design Options' },
            { number: '4.8★', label: 'Average Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white text-black p-6 md:p-8 rounded-xl text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm md:text-base font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default OurStory;

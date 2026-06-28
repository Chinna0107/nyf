import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappNumber = '8686265252';
    const text = `*New Contact Inquiry*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactInfo = [
    { icon: '📍', title: 'Address', content: 'Contact us via email or WhatsApp for any queries' },
    { icon: '📞', title: 'Phone', content: '+91 86862 65252' },
    { icon: '✉️', title: 'Email', content: 'tejaharsha233@gmail.com' },
    { icon: '🕐', title: 'Hours', content: 'Mon-Fri: 10AM-7PM, Sat: 11AM-5PM' }
  ];

  return (
    <div className="bg-[#fbfbfc] min-h-screen text-[#0c0c0e]">
      {/* Premium Hero Section */}
      <section className="relative py-20 px-8 text-center bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">NYF TOTH</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0c0c0e] mb-6">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
            Have questions about our T-shirts or need assistance? Drop us a line. Our team will respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} gap-6`}>
          {contactInfo.map((info, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#d4af37]/35 shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between min-h-[220px]">
              <div>
                <div className="text-3xl mb-4 bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center border border-gray-100">{info.icon}</div>
                <h3 className="text-base font-bold text-[#0c0c0e] mb-2">{info.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-normal">{info.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form and Map Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-24 border-t border-gray-100 pt-16">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-12`}>
          
          {/* Contact form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0e] mb-8">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c0c0e] placeholder-gray-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c0c0e] placeholder-gray-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Styling inquiry / General support"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c0c0e] placeholder-gray-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="How can we assist you with your fit?"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c0c0e] placeholder-gray-400 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Send Message
              </button>

              {submitted && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-semibold text-center animate-pulse">
                  ✓ Message sent. Our team will connect back with you within 24 hours.
                </div>
              )}
            </form>
          </div>

          {/* Value Proposition Column */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] block mb-2">OUR STANDARDS</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0c0c0e] mb-4">Why connect with us?</h2>
              <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
                At NYF TOTH, quality T-shirts and customer satisfaction are our identity. We offer dedicated assistance to ensure every client stands out gracefully.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: '👑', title: 'Styling Consultation', text: 'Reach out to schedule structured coordinate fitting with our head directors.' },
                { icon: '🧵', title: 'Bespoke Alteration Queries', text: 'Need a custom sleeve, chest length adjustment, or custom embroidery details? Ask away.' },
                { icon: '📦', title: 'Secure Expedited Returns', text: 'Questions on tracking shipments or initiating premium exchanges?' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0c0c0e] mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;

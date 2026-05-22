import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="bg-[#0c0c0e] border-t border-white/5 mt-16 md:mt-24">
      {/* Footer Grid */}
      <div className={`max-w-7xl mx-auto px-8 py-16 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-5'} gap-8 md:gap-12`}>
        
        {/* Lovito Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-[0.25em] text-white">LOVITO</h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            Premium luxury fashion and styling. Creating bespoke, structured garments designed to elevate daily street aesthetics.
          </p>
          <div className="flex gap-4 pt-2">
            <FaInstagram className="text-gray-400 hover:text-[#d4af37] text-lg cursor-pointer hover:scale-110 transition-all duration-300" />
            <FaFacebookF className="text-gray-400 hover:text-[#d4af37] text-lg cursor-pointer hover:scale-110 transition-all duration-300" />
            <FaTwitter className="text-gray-400 hover:text-[#d4af37] text-lg cursor-pointer hover:scale-110 transition-all duration-300" />
          </div>
        </div>

        {/* Shop Section */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Shop</h3>
          <div className="flex flex-col gap-3 font-light text-sm">
            <Link to="/tshirts" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              T-Shirts
            </Link>
            <Link to="/shirts" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Shirts
            </Link>
            <Link to="/trackpants" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Track Pants
            </Link>
            <Link to="/pants" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Pants
            </Link>
            <Link to="/sweatshirts" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Sweatshirts & Hoodies
            </Link>
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Company</h3>
          <div className="flex flex-col gap-3 font-light text-sm">
            <Link to="/our-story" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Our Story
            </Link>
            <Link to="/about" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              About Us
            </Link>
            <Link to="/custom" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Dress Up with Chinna
            </Link>
            <Link to="/contact" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Contact Concierge
            </Link>
          </div>
        </div>

        {/* Policies Section */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Policies</h3>
          <div className="flex flex-col gap-3 font-light text-sm">
            <Link to="/terms-and-conditions" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/shipping-policy" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Shipping Policy
            </Link>
            <Link to="/refund-policy" className="text-gray-400 no-underline hover:text-[#d4af37] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

        {/* Contact Atelier Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Contact Concierge</h3>
          <div className="flex flex-col gap-4 font-light text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#d4af37] mt-1 shrink-0" size={14} />
              <span className="leading-relaxed">Plot 42, Jubilee Hills Road No. 36, Hyderabad, TS, 500033</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#d4af37] shrink-0" size={13} />
              <a href="tel:+919000012345" className="hover:text-[#d4af37] transition-colors">+91 90000 12345</a>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#d4af37] shrink-0" size={13} />
              <a href="mailto:concierge@lovito.com" className="hover:text-[#d4af37] transition-colors">concierge@lovito.com</a>
            </div>
            <div className="flex items-start gap-3">
              <FaRegClock className="text-[#d4af37] mt-0.5 shrink-0" size={14} />
              <div>
                <p className="text-gray-400 text-xs font-light">Mon - Sat: 10:00 AM - 7:00 PM</p>
                <p className="text-gray-500 text-[10px] font-light mt-0.5">Sunday Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/5 px-8 py-8 text-center bg-[#070708]">
        <p className="text-gray-500 text-xs font-light">
          © {new Date().getFullYear()} LOVITO. All rights reserved.
          <br />
          Developed with ❤️ by{" "}
          <a 
            href="https://zewo.in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-[#d4af37] font-semibold no-underline hover:underline"
          >
            zewo
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

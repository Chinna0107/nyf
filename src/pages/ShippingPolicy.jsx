import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="bg-[#fbfbfc] min-h-screen py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            NYF TOTH CONCIERGE
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0c0c0e] mb-4">
            Shipping Policy
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light tracking-wide">
            Effective Date: May 22, 2026 • Delivery &amp; Distribution Details
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_10px_40px_rgba(12,12,14,0.02)] space-y-12">
          <div className="text-gray-600 leading-relaxed text-sm md:text-base font-light space-y-10">
            
            {/* Shipping Methods */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Shipping Methods &amp; Costs
              </h2>
              <p className="mb-6">
                We offer multiple premium shipping configurations to accommodate your schedule. Every package is handled with the utmost care, wrapped in signature NYF TOTH linen bags and secure boxing:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#fbfbfc] p-6 rounded-2xl border border-gray-50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase">STANDARD</span>
                    <h3 className="text-lg font-bold text-[#0c0c0e] mt-1 mb-2">5-7 Business Days</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Reliable and fully tracked delivery to all major locations across the territory.
                    </p>
                  </div>
                  <span className="text-[#0c0c0e] font-bold text-sm mt-4">$10.00 <span className="text-xs text-gray-400 font-normal">(Free over $100)</span></span>
                </div>

                <div className="bg-[#fbfbfc] p-6 rounded-2xl border border-gray-50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase">EXPRESS</span>
                    <h3 className="text-lg font-bold text-[#0c0c0e] mt-1 mb-2">2-3 Business Days</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Accelerated dispatch and premium scheduling for urgent drop delivery.
                    </p>
                  </div>
                  <span className="text-[#0c0c0e] font-bold text-sm mt-4">$20.00</span>
                </div>

                <div className="bg-[#fbfbfc] p-6 rounded-2xl border border-gray-50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase">OVERNIGHT</span>
                    <h3 className="text-lg font-bold text-[#0c0c0e] mt-1 mb-2">Next Business Day</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Priority next-day morning delivery for immediate wardrobe requirements.
                    </p>
                  </div>
                  <span className="text-[#0c0c0e] font-bold text-sm mt-4">$35.00</span>
                </div>

                <div className="bg-[#fbfbfc] p-6 rounded-2xl border border-[#d4af37]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase">COMPLIMENTARY</span>
                    <h3 className="text-lg font-bold text-[#0c0c0e] mt-1 mb-2">Free Standard Shipping</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Automatically applied at checkout on all orders exceeding $100.
                    </p>
                  </div>
                  <span className="text-[#d4af37] font-bold text-sm mt-4">FREE</span>
                </div>
              </div>
            </section>

            {/* Processing Time */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Processing Time
              </h2>
              <p>
                All ready-to-wear orders are processed and readied for dispatch within <strong>1-2 business days</strong>. Order processing is suspended during weekends and official public holidays. When custom styled coordinate orders are ready, you will receive a tracking link via email instantly.
              </p>
            </section>

            {/* Delivery Areas */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Delivery Areas &amp; Destinations
              </h2>
              <p>
                We currently support door-to-door delivery across all pin codes in India. Select international shipping is also fully operational. Delivery availability and accurate customs estimations can be computed during checkout relative to your destination country.
              </p>
            </section>

            {/* Tracking Your Order */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Tracking Your Order
              </h2>
              <p>
                As soon as your shipment leaves the NYF TOTH atelier, a dispatch email containing a live tracking link and code is issued. We highly recommend using these details to monitor delivery timelines and coordinate drop-off arrangements directly.
              </p>
            </section>

            {/* Delivery Confirmation */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Delivery Confirmation
              </h2>
              <p>
                Due to the premium value of our styled collections, all NYF TOTH deliveries require a direct physical signature upon receipt. If you are not present during delivery attempts, courier services will leave detailed notices and reschedule alternate slots or arrange nearby storage pickups.
              </p>
            </section>

            {/* Lost or Damaged */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Lost or Damaged Packages
              </h2>
              <p>
                If a delivery package arrives with obvious structural damage or goes missing in transit, please contact us immediately with clear photos of the package and your tracking identifier. We will coordinate directly with carrier channels to dispatch an immediate replacement or issue a full refund.
              </p>
            </section>

            {/* Customs and Duties */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Customs and Duties
              </h2>
              <p>
                For all international orders, additional customs duties, VAT, or local taxes may be levied upon entering the target territory. These charges are governed directly by regional import regulations and are solely the client's responsibility.
              </p>
            </section>

            {/* Bulk Orders */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Bulk Orders &amp; Corporate Gifting
              </h2>
              <p>
                For large volume orders exceeding 10 garments, please consult directly with our logistics team at{' '}
                <a href="mailto:sales@nyftothcloth@gmail.com" className="text-[#d4af37] hover:text-[#0c0c0e] underline transition-colors font-medium">
                  sales@nyftothcloth@gmail.com
                </a>
                . We will arrange bespoke courier rates, tailored dispatch configurations, and personalized packaging coordinates.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Contact Shipping Concierge
              </h2>
              <p>
                For further inquiries, formal requests, or detailed clarifications regarding this Shipping Policy, please email us at{' '}
                <a href="mailto:shipping@nyftothcloth@gmail.com" className="text-[#d4af37] hover:text-[#0c0c0e] underline transition-colors font-medium">
                  shipping@nyftothcloth@gmail.com
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

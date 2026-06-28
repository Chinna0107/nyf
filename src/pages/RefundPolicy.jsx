import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="bg-[#fbfbfc] min-h-screen py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            NYF TOTH CONCIERGE
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0c0c0e] mb-4">
            Refund Policy
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light tracking-wide">
            Effective Date: May 22, 2026 • Return &amp; Exchange Guidelines
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_10px_40px_rgba(12,12,14,0.02)] space-y-12">
          <div className="text-gray-600 leading-relaxed text-sm md:text-base font-light space-y-10">
            
            {/* Return Window */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Return Window
              </h2>
              <p>
                We offer a dedicated <strong>30-day return window</strong> from the date of purchase. To ensure high hygienic and quality standards, all returned garments must be unused, unwashed, unaltered, and in their absolute original condition with all security tags and brand packaging fully intact.
              </p>
            </section>

            {/* Eligibility */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Eligibility for Returns
              </h2>
              <p className="mb-4">To complete a return successfully, the items must satisfy the following strict criteria:</p>
              <ul className="space-y-3 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Garments must be shipped back within 30 days of the purchase date.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Items must be entirely unworn, unperfumed, and unwashed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>All original designer tags, sizing labels, and packaging sleeves must remain attached.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Bespoke styled collections or final-sale clearance items cannot be returned unless verified as defective upon arrival.</span>
                </li>
              </ul>
            </section>

            {/* Process Guide */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                How to Initiate a Return
              </h2>
              <p className="mb-6">Please follow our seamless, curated return process to guarantee swift reimbursement:</p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 rounded-xl bg-[#fbfbfc] border border-gray-50">
                  <span className="bg-[#0c0c0e] text-[#fbfbfc] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-serif">1</span>
                  <div>
                    <h4 className="font-bold text-[#0c0c0e] text-sm">Contact support</h4>
                    <p className="text-xs text-gray-500 font-light mt-1">
                      Email our team at <a href="mailto:returns@nyftothcloth@gmail.com" className="text-[#d4af37] underline">returns@nyftothcloth@gmail.com</a> quoting your order reference.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-xl bg-[#fbfbfc] border border-gray-50">
                  <span className="bg-[#0c0c0e] text-[#fbfbfc] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-serif">2</span>
                  <div>
                    <h4 className="font-bold text-[#0c0c0e] text-sm">Provide details</h4>
                    <p className="text-xs text-gray-500 font-light mt-1">
                      Include high-resolution photographs if returning items believed to be defective or damaged during shipment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-xl bg-[#fbfbfc] border border-gray-50">
                  <span className="bg-[#0c0c0e] text-[#fbfbfc] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-serif">3</span>
                  <div>
                    <h4 className="font-bold text-[#0c0c0e] text-sm">Obtain RMA code &amp; label</h4>
                    <p className="text-xs text-gray-500 font-light mt-1">
                      Upon validation, you will receive a Return Merchandise Authorization (RMA) code and a secure shipping label.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-xl bg-[#fbfbfc] border border-gray-50">
                  <span className="bg-[#0c0c0e] text-[#fbfbfc] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-serif">4</span>
                  <div>
                    <h4 className="font-bold text-[#0c0c0e] text-sm">Ship and wait</h4>
                    <p className="text-xs text-gray-500 font-light mt-1">
                      Pack items securely and dispatch them. Once inspected, your refund will be authorized.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Processing */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Refund Processing
              </h2>
              <p>
                Approved returns will be processed within <strong>7-10 business days</strong> after we receive and inspect the packages. The refund will be credited directly to your original payment method. Depending on your banking institution, it may require an additional 3-5 business days for the funds to reflect in your account statements.
              </p>
            </section>

            {/* Shipping Costs */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Shipping Costs
              </h2>
              <p>
                Original delivery costs are non-refundable. For returns due to style preference or size adjustment, return shipping expenses are the responsibility of the client. If an item is verified as defective or damaged upon delivery, NYF TOTH will cover all shipping costs and supply a pre-paid shipping label.
              </p>
            </section>

            {/* Defective or Damaged */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Defective or Damaged Items
              </h2>
              <p>
                If you receive a flawed or damaged garment, please notify our styling concierge team immediately at <a href="mailto:returns@nyftothcloth@gmail.com" className="text-[#d4af37] underline hover:text-[#0c0c0e] transition-colors">returns@nyftothcloth@gmail.com</a> with photographs. We will prioritize dispatching a brand-new replacement item or executing a full refund.
              </p>
            </section>

            {/* Non-Returnable */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Non-Returnable Items
              </h2>
              <p className="mb-4">The following items are completely ineligible for return or exchange:</p>
              <ul className="space-y-3 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Items returned after the 30-day window.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Garments that have been worn, washed, customized, or altered in any manner.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Items missing original designer tags or packaging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>Products purchased under final clearance, special promotional sales, or designer drops.</span>
                </li>
              </ul>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Contact Returns Concierge
              </h2>
              <p>
                For further inquiries, formal requests, or detailed clarifications regarding this Refund Policy, please email us at{' '}
                <a href="mailto:returns@nyftothcloth@gmail.com" className="text-[#d4af37] hover:text-[#0c0c0e] underline transition-colors font-medium">
                  returns@nyftothcloth@gmail.com
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

export default RefundPolicy;

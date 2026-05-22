import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#fbfbfc] min-h-screen py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            LOVITO CONCIERGE
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0c0c0e] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light tracking-wide">
            Effective Date: May 22, 2026 • Premium Fashion & Styling Studio
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_10px_40px_rgba(12,12,14,0.02)] space-y-12">
          <div className="text-gray-600 leading-relaxed text-sm md:text-base font-light space-y-10">
            
            {/* Introduction Section */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Introduction
              </h2>
              <p>
                <strong>Lovito</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the Lovito digital storefront and styling platform. This document outlines our professional practices and policies regarding the collection, processing, and safeguarding of personal data when you interact with our website, order bespoke styling collections, or use our specialized services.
              </p>
            </section>

            {/* Information Collection Section */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Information Collection &amp; Use
              </h2>
              <p className="mb-6">
                To deliver the finest bespoke shopping experience and personalized styling guides, we collect and process several categories of information:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div className="bg-[#fbfbfc] p-5 rounded-2xl border border-gray-50">
                  <div className="text-[#d4af37] text-2xl mb-3">👤</div>
                  <h4 className="font-bold text-[#0c0c0e] mb-2 text-sm uppercase tracking-wider">Personal Data</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Name, shipping/billing address, phone number, email address, and precise sizing details for tailoring.
                  </p>
                </div>
                
                <div className="bg-[#fbfbfc] p-5 rounded-2xl border border-gray-50">
                  <div className="text-[#d4af37] text-2xl mb-3">💻</div>
                  <h4 className="font-bold text-[#0c0c0e] mb-2 text-sm uppercase tracking-wider">Usage Data</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    IP addresses, browser configurations, page interactions, navigation sequences, and styling preference histories.
                  </p>
                </div>

                <div className="bg-[#fbfbfc] p-5 rounded-2xl border border-gray-50">
                  <div className="text-[#d4af37] text-2xl mb-3">💳</div>
                  <h4 className="font-bold text-[#0c0c0e] mb-2 text-sm uppercase tracking-wider">Payment Details</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Secure tokens processed through industry-standard PCI-compliant payment gateways. We never store raw credit card info.
                  </p>
                </div>
              </div>
            </section>

            {/* Use of Data Section */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Use of Data
              </h2>
              <p className="mb-4">
                Lovito uses your data in accordance with high privacy standards to achieve specific goals:
              </p>
              <ul className="space-y-3 pl-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>To curate custom wardrobe recommendations and execute Chinna's expert style matching processes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>To securely process transactions, coordinate fulfillment, and dispatch tracking details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>To notify you about limited seasonal drops, new capsule collections, and bespoke designer collaborations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#d4af37] mt-0.5">•</span>
                  <span>To monitor overall interface performance and enhance the visual excellence of our digital storefront.</span>
                </li>
              </ul>
            </section>

            {/* Security Section */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Security of Data
              </h2>
              <p>
                The security of your personal information is of paramount importance to us. We employ state-of-the-art administrative, technical, and physical security measures, including advanced encryption protocols, to protect your details. However, please be advised that no method of transmission over the internet is completely infallible. While we strive to ensure total protection, absolute security cannot be guaranteed.
              </p>
            </section>

            {/* Your Rights Section */}
            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Your Rights
              </h2>
              <p>
                As a valued member of the Lovito community, you retain full rights to access, amend, restrict, or purge your personal data. If you wish to retrieve your profile details or request removal from our servers, please coordinate directly with our legal desk at{' '}
                <a href="mailto:privacy@lovito.com" className="text-[#d4af37] hover:text-[#0c0c0e] underline transition-colors font-medium">
                  privacy@lovito.com
                </a>.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0c0c0e] mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full inline-block"></span>
                Contact Legal Concierge
              </h2>
              <p>
                For further inquiries, formal requests, or detailed clarifications regarding this Privacy Policy, please email us at{' '}
                <a href="mailto:privacy@lovito.com" className="text-[#d4af37] hover:text-[#0c0c0e] underline transition-colors font-medium">
                  privacy@lovito.com
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

export default PrivacyPolicy;

"use client";

import React, { useState } from 'react';

const PrivacyPolicyContent = () => (
  <>
    <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">Privacy Policy</h1>
    <p className="text-sm text-[#6b6b6b] mb-6">Effective date: [DATE] · Operated by JayakHub, [legal entity], Baghdad, Iraq</p>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      JayakHub ("we", "our") operates a food-ordering and delivery platform connecting customers, restaurants, and delivery drivers in Iraq. This policy explains what data we collect and how we use it.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">1. Data we collect</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li><strong>Account data:</strong> name, phone number, email (optional), profile photo.</li>
      <li><strong>Location data:</strong> delivery addresses and, for drivers, real-time GPS while on an active order, to enable delivery and tracking.</li>
      <li><strong>Order data:</strong> items ordered, prices, delivery instructions, order history.</li>
      <li><strong>Payment data:</strong> payment method selected (e.g. Cash on Delivery). Card/wallet details, where supported, are processed by the payment provider; we do not store full card numbers.</li>
      <li><strong>Restaurant & driver data:</strong> business and KYC details, documents, vehicle and inspection records, earnings and payout details.</li>
      <li><strong>Device & usage data:</strong> device identifiers, app interactions, and diagnostics for security and fraud prevention.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">2. How we use data</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li>To process and deliver orders, calculate ETAs, and route drivers.</li>
      <li>To process payments and payouts.</li>
      <li>To provide support, prevent fraud, and meet legal obligations.</li>
      <li>For service communications and, with consent, marketing.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">3. Location tracking</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Driver location is collected only during active orders to enable delivery and live tracking, and stops when the driver goes offline. Customer location is used to set delivery addresses and ETAs.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">4. Cookies & similar technologies</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Our website and apps use cookies/identifiers for sessions, preferences, analytics, and fraud prevention. You can manage consent in app settings.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">5. Data sharing</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      We share order-necessary data between the customer, the restaurant, and the assigned driver. We use service providers (hosting, mapping, payment processing) under contract. We do not sell your personal data.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">6. Security</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      We use encryption in transit, access controls, and monitoring. No system is perfectly secure; we will notify affected users and authorities of qualifying breaches as required by law.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">7. Data retention</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      We keep personal data only as long as needed for the service and legal/accounting requirements. On account deletion we remove personal data and retain limited order/financial records where law requires.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">8. Your rights</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      You may request access, export, correction, or deletion of your data, and manage marketing consent, in app settings or by contacting us. See the Account Deletion policy.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">9. Contact</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
      Privacy questions: <strong>privacy@jayakhub.com</strong> · JayakHub, [address], Baghdad, Iraq.
    </p>
  </>
);

const TermsOfServiceContent = () => (
  <>
    <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">Terms of Service</h1>
    <p className="text-sm text-[#6b6b6b] mb-6">Effective date: [DATE]</p>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      By using JayakHub you agree to these terms. JayakHub is a subscription platform: restaurants pay a fixed monthly subscription and JayakHub charges no commission on orders.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">1. User (customer) responsibilities</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li>Provide accurate account, address, and contact details.</li>
      <li>Pay for orders by the selected method (e.g. Cash on Delivery).</li>
      <li>Be available to receive deliveries and treat drivers respectfully.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">2. Restaurant responsibilities</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li>Maintain an active subscription and accurate menu, pricing, and availability.</li>
      <li>Honor in-app prices (price-match) and food-safety standards.</li>
      <li>Prepare orders promptly and accurately.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">3. Driver responsibilities</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li>Maintain valid documents, vehicle, and inspection.</li>
      <li>Follow traffic and safety rules; handle food and cash responsibly.</li>
      <li>Deliver orders promptly and communicate professionally.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">4. Account suspension & termination</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      We may suspend or terminate accounts for fraud, abuse, repeated violations, unsafe conduct, or non-payment of subscription, with notice where reasonable.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">5. Platform rules</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      No fraudulent orders, promo abuse, harassment, or unlawful use. JayakHub is an intermediary platform and is not the producer of the food.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">6. Limitation of liability</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      To the extent permitted by Iraqi law, JayakHub is not liable for indirect or consequential damages. Our total liability for any claim is limited as set out here. Nothing limits liability that cannot be excluded by law.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">7. Changes & governing law</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
      We may update these terms with notice. These terms are governed by the laws of Iraq. Contact: <strong>legal@jayakhub.com</strong>.
    </p>
  </>
);

const RefundPolicyContent = () => (
  <>
    <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">Refund Policy</h1>
    <p className="text-sm text-[#6b6b6b] mb-6">Effective date: [DATE]</p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">1. Order cancellation</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Orders may be cancelled before the restaurant accepts them at no charge. After preparation begins, cancellation may not be possible, or partial charges may apply.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">2. Restaurant mistakes</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      For wrong, missing, or unsafe items, report the issue in-app with a photo. Valid complaints receive a full or partial refund.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">3. Driver / delivery issues</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      For non-delivery or significant delay caused by the platform or driver, you may be eligible for a refund and/or credit.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">4. Payment disputes</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Disputes are reviewed by our support team with full order context. We may request evidence (photos, messages) before resolving.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">5. Refund timelines</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li><strong>Cash on Delivery:</strong> refund issued as account credit or arranged return.</li>
      <li><strong>Card/wallet (where available):</strong> refunded to the original method, typically within 3–10 business days depending on the provider.</li>
    </ul>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
      Contact: <strong>support@jayakhub.com</strong>.
    </p>
  </>
);

const DeliveryPolicyContent = () => (
  <>
    <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">Delivery Policy</h1>
    <p className="text-sm text-[#6b6b6b] mb-6">Effective date: [DATE]</p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">1. Service areas</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Delivery is available within active JayakHub zones in served Iraqi cities. Availability is shown at checkout based on your address.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">2. Delivery windows & fees</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Estimated delivery times are shown before you order. A delivery fee (starting at approximately $2 / equivalent in IQD) applies and is displayed at checkout. Available payment methods vary by city and merchant.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">3. Delays</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Delays can occur due to traffic, weather, restaurant volume, or driver availability. We update your ETA live and notify you of significant delays.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">4. Driver availability</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
      During peak periods or low driver supply in a zone, delivery times may increase or ordering may be temporarily limited to protect quality.
    </p>
  </>
);

const AccountDeletionPolicyContent = () => (
  <>
    <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">Account Deletion Policy</h1>
    <p className="text-sm text-[#6b6b6b] mb-6">Effective date: [DATE] · Public deletion request URL: jayakhub.com/delete-account</p>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      You can request deletion of your account and associated data at any time, in-app (Settings → Privacy → Delete Account) or via the public URL above, without reinstalling the app.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">1. Customer account deletion</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Deletes your profile, saved addresses, payment methods, loyalty points, and marketing data. Removes active sessions and notifications.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">2. Driver account deletion</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Deletes personal profile and contact data. Some KYC, earnings, and tax records are retained for the period required by law before erasure.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">3. Restaurant account deletion</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">
      Closes the subscription and removes business profile data. Financial and invoicing records are retained as required by accounting law.
    </p>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">4. Data retention rules</h2>
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      <li>Personal data is deleted promptly upon a verified request.</li>
      <li>Limited order, financial, and tax records are retained for the legally required period, then erased.</li>
      <li>Data needed for fraud prevention or legal claims may be retained as permitted by law.</li>
    </ul>

    <h2 className="text-lg font-bold text-[#1B3A57] mb-3">5. How to request</h2>
    <p className="text-[15px] leading-relaxed text-[#1a1a1a]">
      In-app: Settings → Privacy → Delete Account. Web: jayakhub.com/delete-account. Questions: <strong>privacy@jayakhub.com</strong>.
    </p>
  </>
);

const TABS = [
  { id: 'privacy', label: 'Privacy Policy', component: PrivacyPolicyContent },
  { id: 'terms', label: 'Terms of Service', component: TermsOfServiceContent },
  { id: 'refund', label: 'Refund Policy', component: RefundPolicyContent },
  { id: 'delivery', label: 'Delivery Policy', component: DeliveryPolicyContent },
  { id: 'deletion', label: 'Account Deletion', component: AccountDeletionPolicyContent },
];

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component || PrivacyPolicyContent;

  return (
    <div className="min-h-screen bg-[#F2F2ED] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Alert Banner */}
        <div className="bg-[#FFF8E1] border border-[#FFB300] rounded-lg p-4 mb-8 flex gap-3 shadow-sm">
          <span className="text-[#F57C00] font-bold">⚠️</span>
          <p className="text-sm text-[#5D4037] leading-relaxed">
            <strong>Draft for review.</strong> These policies are production-ready templates tailored to JayakHub's subscription model and Iraqi operations. They are not legal advice and must be reviewed and approved by a qualified Iraqi lawyer before publication. Replace bracketed company details and host each policy at a public URL for Google Play.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#e5e0d8] mb-8 overflow-x-auto no-scrollbar">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-[#FF6B35] text-[#FF6B35]'
                      : 'border-transparent text-[#6b6b6b] hover:text-[#1B3A57] hover:border-[#1B3A57]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[16px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#e5e0d8]">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

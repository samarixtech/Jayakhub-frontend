"use client";

import { Shield, Lock, Eye, FileText, Bell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Helper for Section Heading
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="text-center mb-14">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
      {title}
    </h2>
    <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

// Helper for Privacy Cards
const PrivacyCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="group bg-[#E8F4F1] border border-[#FFF9EE] rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
    <div className="flex items-center gap-4 mb-5">
      <div className="bg-linear-to-r from-[#0B5D4E] to-yellow-500 p-3 rounded-2xl text-[#E8F4F1] shadow-md group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const PolicyContentSection = React.forwardRef(
  ({ id, title, children }: any, ref: React.ForwardedRef<HTMLDivElement>) => (
    <div id={id} ref={ref} className="pt-20 -mt-16 pb-8">
      <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-yellow-400/50 inline-block pb-2">
        {title}
      </h3>
      <div className="text-xl text-gray-700 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  )
);

PolicyContentSection.displayName = "PolicyContentSection";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("section1");

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const policySections = [
    {
      id: "section1",
      title: "1. Information We Collect",
      subtitle: "Data Types & Sources",
    },
    {
      id: "section2",
      title: "2. How We Use Your Data",
      subtitle: "Purpose & Legal Basis",
    },
    {
      id: "section3",
      title: "3. Data Sharing and Disclosure",
      subtitle: "Third Parties & Affiliates",
    },
    {
      id: "section4",
      title: "4. Global Compliance & Retention",
      subtitle: "GDPR, CCPA, and Timelines",
    },
    {
      id: "section5",
      title: "5. Your Rights and Choices",
      subtitle: "Access, Deletion, and Opt-Out",
    },
  ];

  // Scrollspy logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0.2,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NEW HEADER/HERO SECTION */}
      <section className="relative bg-[#E8F4F1] pt-20 pb-16 md:pt-32 border-b border-[#FFF9EE]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Privacy Notice:
              <span className="block text-[#0B5D4E]">Customers and Users</span>
            </h1>

            <p className="text-xl text-gray-700 font-medium">
              Your data is a serious responsibility. We are committed to
              complete transparency in our privacy practices.
            </p>

            <p className="text-lg text-gray-600">
              This notice describes the personal data we collect, how it used
              and shared, and your choices regarding this data. We recommend
              that you read this along with our privacy overview, which
              highlights key points about our privacy practices.
            </p>

            <div className="pt-4 space-y-2">
              <a
                href="#"
                className="text-lg font-medium text-[#0B5D4E] hover:text-yellow-600 flex items-center gap-2 transition-colors group"
              >
                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                Privacy Notice: Restaurants and Delivery Partners
              </a>
              <a
                href="#"
                className="text-lg font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Previous versions of the Privacy Notice
              </a>
            </div>
          </div>

          {/* Right Column: Illustration/Image Placeholder */}
          <div className="mt-8 md:mt-0 flex justify-center md:justify-end">
            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-linear-to-br from-[#0B5D4E] to-yellow-100 flex items-center justify-center p-8">
                <Shield className="w-32 h-32 text-[#0B5D4E] opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END HEADER */}

      {/* OVERVIEW SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title="Privacy at the Core"
            subtitle="We believe data security is not an afterthought — it's our foundation."
          />
          <div className="grid md:grid-cols-3 gap-10">
            <PrivacyCard
              icon={Shield}
              title="Data Security"
              description="Your data is encrypted both in transit and at rest, protected by the latest security protocols and continuous system audits."
            />
            <PrivacyCard
              icon={Lock}
              title="Confidentiality"
              description="We never sell or share your information with unauthorized third parties. Your trust is the core of our service promise."
            />
            <PrivacyCard
              icon={Eye}
              title="Transparency"
              description="Our privacy policy is written to be clear, concise, and accessible — so you know exactly how your data is used."
            />
          </div>
        </div>
      </section>

      {/* POLICY CONTENT WITH STICKY TOC */}
      <section className="bg-[#E8F4F1] py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-4 gap-12">
          {/* Left Column: Sticky Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 pt-4 pb-8 lg:pt-0">
              <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Table of Contents
              </h4>
              <nav className="space-y-2 border-l-2 border-[#FFF9EE] pl-4">
                {policySections.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo(item.id);
                    }}
                    className={`block py-2 pr-4 transition-all duration-200 rounded-lg -ml-4 pl-4 cursor-pointer 
                      ${
                        activeSection === item.id
                          ? "bg-[#0B5D4E] text-[#0B5D4E] font-bold border-[#0B5D4E] border-l-4 -translate-x-1"
                          : "text-gray-600 hover:text-[#B6932F] hover:bg-gray-50"
                      }`}
                  >
                    <span className="block text-sm font-semibold">
                      {item.title.split(". ")[0]}.
                    </span>
                    <span className="block text-xs text-gray-500">
                      {item.subtitle}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* 1. Information We Collect */}
            <PolicyContentSection
              id="section1"
              title={policySections[0].title}
              ref={(el: any) => (sectionRefs.current[0] = el)}
            >
              <p>
                We collect personal information necessary for the provision of
                our delivery and logistics services. This includes data you
                provide directly, and data collected automatically during
                service use.
              </p>
              <div className="p-6 bg-gray-50 rounded-xl border border-[#FFF9EE] space-y-3">
                <p className="font-bold text-gray-900">Key Data Points:</p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>
                    Registration Data: Full name, email, phone number, and
                    account credentials.
                  </li>
                  <li>
                    Transaction Data: Order details, payment method (securely
                    tokenized), and shipping address.
                  </li>
                  <li>
                    Location Data: Precise geographic location, required for
                    order tracking and delivery fulfillment. You may disable
                    this, but it will impact core functionality.
                  </li>
                  <li>
                    Device Data: IP address, browser type, operating system, and
                    unique device identifiers for security.
                  </li>
                </ul>
              </div>
            </PolicyContentSection>

            {/* 2. How We Use Your Data */}
            <PolicyContentSection
              id="section2"
              title={policySections[1].title}
              ref={(el: any) => (sectionRefs.current[1] = el)}
            >
              <p>
                Your data is exclusively used to operate, maintain, and enhance
                the services you request. Our primary uses include:
              </p>
              <div className="p-6 bg-gray-50 rounded-xl border border-[#FFF9EE] space-y-3">
                <ol className="list-decimal pl-6 space-y-4 text-lg">
                  <li>
                    Service Fulfillment: Processing your orders, confirming
                    payments, and facilitating accurate delivery with our
                    partners.
                  </li>
                  <li>
                    Customer Support: Responding to inquiries, resolving
                    disputes, and providing proactive support related to your
                    service experience.
                  </li>
                  <li>
                    Research & Development: Analyzing trends and user behavior
                    to improve our platform reliability, speed, and security
                    features.
                  </li>
                  <li>
                    Marketing (with Consent): Sending personalized promotions,
                    newsletters, and updates, subject to your explicit consent
                    and easy opt-out options.
                  </li>
                </ol>
              </div>
            </PolicyContentSection>

            {/* 3. Data Sharing and Disclosure */}
            <PolicyContentSection
              id="section3"
              title={policySections[2].title}
              ref={(el: any) => (sectionRefs.current[2] = el)}
            >
              <p>
                We do not sell your personal data. We only share information
                with third parties who are essential to the provision of our
                services, or when legally obligated.
              </p>
              <p>
                Sharing occurs with: Delivery Partners (name, delivery address,
                phone for communication), Restaurant Partners (order details,
                not payment info), and Payment Processors (for secure
                transaction validation).
              </p>
              <div className="bg-[#0B5D4E] p-6 rounded-xl border-l-4 border-[#0B5D4E] shadow-sm text-lg text-gray-800">
                Note: All third-party providers are contractually bound to
                protect your data and are prohibited from using it for any
                purpose other than providing services on our behalf.
              </div>
            </PolicyContentSection>

            {/* 4. Global Compliance & Retention */}
            <PolicyContentSection
              id="section4"
              title={policySections[3].title}
              ref={(el: any) => (sectionRefs.current[3] = el)}
            >
              <p>
                We operate under a global compliance framework, upholding the
                standards of GDPR (Europe) and CCPA (California), among others.
              </p>
              <p>
                Data Retention: We retain personal data only for as long as
                necessary to fulfill the purposes outlined in this notice,
                typically for the duration of your active account plus a maximum
                of two years for audit and dispute resolution purposes.
                Financial transaction data is retained as required by financial
                law.
              </p>
            </PolicyContentSection>

            {/* 5. Your Rights and Choices */}
            <PolicyContentSection
              id="section5"
              title={policySections[4].title}
              ref={(el: any) => (sectionRefs.current[4] = el)}
            >
              <p>
                You have explicit control over your data. We facilitate the
                exercise of your rights to ensure full compliance with
                regulatory requirements:
              </p>
              <div className="p-6 bg-gray-50 rounded-xl border border-[#FFF9EE] space-y-3">
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li>
                    Right to Access: Request a copy of the personal data we hold
                    about you.
                  </li>
                  <li>
                    Right to Correction/Rectification: Update any incomplete or
                    inaccurate data in your profile.
                  </li>
                  <li>
                    Right to Erasure (Right to be Forgotten): Request the
                    deletion of your account and associated data, subject to
                    necessary legal retention periods.
                  </li>
                  <li>
                    Right to Object/Opt-Out: Easily manage your preferences for
                    marketing communications at any time.
                  </li>
                </ul>
              </div>
            </PolicyContentSection>
          </div>
        </div>
      </section>

      {/* NOTIFICATION SECTION */}
      <section className="py-24 bg-linear-to-r from-[#0B5D4E] to-yellow-500 text-[#E8F4F1] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Bell className="w-14 h-14 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-extrabold mb-4">We Keep You Informed</h2>
          <p className="text-lg text-[#E8F4F1]/90 mb-8">
            Whenever we update our privacy practices, you’ll be notified
            immediately. Your awareness and control are our top priorities.
          </p>
          <button className="px-8 py-4 bg-[#E8F4F1] text-[#0B5D4E] font-bold rounded-xl hover:bg-[#FFF9EE] transition-all duration-300 shadow-md">
            Subscribe to Updates
          </button>
        </div>
      </section>

      {/* Component Style for Scrollspy to reference section elements */}
      <style jsx>{`
        /* This is crucial. It adds the necessary padding above the element so that when the browser 
          scrolls to the anchor ID, the sticky header doesn't cover the heading. 
        */
        .PolicyContentSection {
          scroll-margin-top: 120px;
        }
      `}</style>
    </div>
  );
}

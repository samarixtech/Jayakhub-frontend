import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';

const sections = [
    {
        id: 'info-collection',
        title: '1. Information We Collect',
        content: `We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.`,
    },
    {
        id: 'use-info',
        title: '2. How We Use Your Information',
        content: `We use the information we collect to provide, maintain, and improve our services, such as to: facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, and send updates and administrative messages.`,
    },
    {
        id: 'sharing',
        title: '3. Sharing of Information',
        content: `We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with Drivers to enable them to provide the Services you request; with third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us; with the general public if you submit content in a public forum.`,
    },
    {
        id: 'data-retention',
        title: '4. Data Retention',
        content: `We retain user data for as long as necessary for the purposes described above. This means that we retain different categories of data for different periods of time depending on the category of user to whom the data relates, the type of data, and the purposes for which we collected the data.`,
    },
];

export default function PrivacyPolicy() {
    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Header Section */}
            <section className="bg-primary pt-32 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FE8C34]/10 rounded-full blur-[100px]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto z-10 relative">
                    <nav className="flex items-center text-sm text-white/70 mb-8 space-x-2">
                        <span>Legal</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white font-medium">Privacy Policy</span>
                    </nav>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                            <p className="text-white/70 flex items-center gap-2 text-sm">
                                <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                                    <span className="text-[10px] font-serif italic">i</span>
                                </span>
                                Last updated: February 16, 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" className="w-full" preserveAspectRatio="none">
                        <path
                            d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start relative">

                    {/* Sidebar - Table of Contents */}
                    <div className="w-full lg:w-80 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 sticky top-32 h-fit self-start z-10">
                        <div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Table of Contents</h2>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onClick={(e) => scrollToSection(section.id, e)}
                                        className="block text-sm text-gray-600 hover:text-[#0B5D4E] hover:bg-[#0B5D4E]/5 px-4 py-3 rounded-lg transition-colors font-medium border-l-2 border-transparent hover:border-[#0B5D4E]"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-10 pt-10 border-t border-gray-200">
                                <p className="text-xs text-gray-400 mb-2">Need assistance?</p>
                                <a href="/contact" className="text-sm font-bold text-[#1C4A3C] hover:underline">
                                    Contact Support
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {/* Alert Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10">
                            <p className="text-sm text-[#1E40AF] font-medium text-center">
                                Please read this document carefully. By using our services, you agree to be bound by these terms.
                            </p>
                        </div>

                        <div className="space-y-12 max-w-3xl">
                            {sections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold text-[#0a2920] mb-4">{section.title}</h2>
                                    <p className="text-[#0a2920] leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

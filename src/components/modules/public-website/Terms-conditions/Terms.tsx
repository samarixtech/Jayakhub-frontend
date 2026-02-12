import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

const sections = [
    {
        id: 'contractual-relationship',
        title: '1. Contractual Relationship',
        content: `These Terms of Use ("Terms") govern the access or use by you, an individual, from within any country in the world of applications, websites, content, products, and services (the "Services") made available by Jayak Hub.`,
    },
    {
        id: 'the-services',
        title: '2. The Services',
        content: `The Services constitute a technology platform that enables users of Jayak Hub's mobile applications or websites provided as part of the Services to arrange and schedule delivery services with independent third party providers of such services, including independent third party logistics providers under agreement with Jayak Hub.`,
    },
    {
        id: 'use-of-services',
        title: '3. Your Use of the Services',
        content: `User Accounts. In order to use most aspects of the Services, you must register for and maintain an active personal user Services account ("Account"). You must be at least 18 years of age, or the age of legal majority in your jurisdiction (if different than 18), to obtain an Account.`,
    },
    {
        id: 'payment',
        title: '4. Payment',
        content: `You understand that use of the Services may result in charges to you for the services or goods you receive from a Third Party Provider ("Charges"). After you have received services or goods obtained through your use of the Service, Jayak Hub will facilitate your payment of the applicable Charges on behalf of the Third Party Provider as such Third Party Provider's limited payment collection agent.`,
    },
];

export default function Terms() {
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
            {/* Header Section */}
            <section className="bg-primary pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                        <span className="text-white font-medium">Terms of Service</span>
                    </nav>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10 shadow-lg">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                            <p className="text-white/70 flex items-center gap-2 text-sm">
                                <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                                    <span className="text-[10px] font-serif italic">i</span>
                                </span>
                                Last updated: September 12, 2025
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row">

                    {/* Sidebar - Table of Contents */}
                    <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50 p-8 lg:rounded-l-[2rem] rounded-t-[2rem] lg:rounded-tr-none">
                        <div className="lg:sticky lg:top-8">
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
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 p-8 lg:p-12 lg:rounded-r-[2rem] rounded-b-[2rem] lg:rounded-bl-none bg-white">
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



import { ArrowRight, Shield, UserCheck, Activity, Lock, Truck, Smartphone, Check } from 'lucide-react';


const features = [
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "End-to-end encryption for all payments and personal data."
    },
    {
        icon: UserCheck,
        title: "Verified Partners",
        description: "Strict background checks for every driver and restaurant."
    },
    {
        icon: Activity,
        title: "Live Monitoring",
        description: "Real-time GPS tracking of every order from kitchen to door."
    },
    {
        icon: Lock,
        title: "Privacy Shield",
        description: "Masked phone numbers to protect your personal contact info."
    },
    {
        icon: Truck,
        title: "Zero Contact",
        description: "Contact-free delivery options available for every order."
    },
    {
        icon: Smartphone,
        title: "SOS Integration",
        description: "One-tap emergency assistance directly within the app."
    }
];

export default function Safety() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen font-sans">
            {/* Hero Section (Contact Page Style) */}
            <section className="bg-[#0B5D4E] pt-32 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F5A623]/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-sm font-semibold text-white mb-8">
                        <span className="uppercase tracking-wider text-xs">VERIFIED TRUST PLATFORM</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                        Safety Is Our <br />
                        <span className="text-[#FE8C34] relative inline-block">
                            Obsession
                            {/* Custom Underline Curve */}
                            <svg
                                viewBox="0 0 300 20"
                                fill="none"
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-auto text-[#FE8C34]"
                            >
                                <path
                                    d="M10 15C100 5 200 5 290 15"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h1>
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

            {/* Features Grid - positioned below the wave */}
            <div className="relative max-w-7xl mx-auto z-20 pt-12 px-4 sm:px-6 lg:px-8 pb-20">
                <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 text-[#0B5D4E]">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0a2920] mb-3">{feature.title}</h3>
                                <p className="text-[#6b7280] leading-relaxed text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Impact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px]">
                        {/* Image with strong shadow */}
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
                                alt="Team hands together"
                                className="w-full h-full object-cover"
                            />

                            {/* Blackish shade at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Impact Overlay Card - Smaller width */}
                            <div className="absolute bottom-6 left-8 w-[280px] bg-white/5 backdrop-blur-xs border border-white/20 p-5 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center shrink-0 shadow-sm text-white">
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <p className="font-bold text-white text-base">100% Certified</p>
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed pl-1">
                                    Every rider completes our 5-point safety training module.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="inline-block mb-4">
                            <span className="text-xs font-bold text-[#1C4A3C] uppercase tracking-widest">OUR IMPACT</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-[#0A2920] mb-6 leading-[1.15]">
                            Setting the standard for the industry.
                        </h2>
                        <p className="text-[#6b7280] mb-12 text-lg leading-relaxed">
                            We don't just follow safety regulations – we create them. Our standards are 2x stricter than local requirements.
                        </p>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">Incidents per million orders</span>
                                <span className="text-2xl font-bold text-[#0A2920]">&lt; 0.01%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">Rider training hours</span>
                                <span className="text-2xl font-bold text-[#0A2920]">45,000+</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">Safety features developed</span>
                                <span className="text-2xl font-bold text-[#0A2920]">12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Guidelines CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                    {/* Left Blur (Top & Mid) */}
                    <div className="absolute top-0 left-0 w-[300px] h-[80%] bg-[#1C4A3C]/40 blur-[80px] -translate-x-1/2 rounded-full" />

                    {/* Right Blur (Bottom & Mid) */}
                    <div className="absolute bottom-0 right-0 w-[300px] h-[80%] bg-[#1C4A3C]/40 blur-[80px] translate-x-1/2 rounded-full" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Community Guidelines</h2>
                        <p className="text-white/60 mb-10 text-lg">
                            Safety is a shared responsibility. We ask everyone in our ecosystem to treat each other with respect, kindness, and patience.
                        </p>
                        <button className="bg-white text-[#0A2920] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center gap-2 hover:gap-3">
                            Read the Guidelines
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

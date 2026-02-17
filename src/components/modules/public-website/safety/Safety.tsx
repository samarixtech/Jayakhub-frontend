

import { ArrowRight, Shield, UserCheck, Activity, Lock, Truck, Smartphone, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';




export default function Safety() {
    const t = useTranslations('Safety');

    const features = [
        {
            icon: Shield,
            title: t('features.security.title'),
            description: t('features.security.desc')
        },
        {
            icon: UserCheck,
            title: t('features.verified.title'),
            description: t('features.verified.desc')
        },
        {
            icon: Activity,
            title: t('features.monitoring.title'),
            description: t('features.monitoring.desc')
        },
        {
            icon: Lock,
            title: t('features.privacy.title'),
            description: t('features.privacy.desc')
        },
        {
            icon: Truck,
            title: t('features.zero_contact.title'),
            description: t('features.zero_contact.desc')
        },
        {
            icon: Smartphone,
            title: t('features.sos.title'),
            description: t('features.sos.desc')
        }
    ];
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
                        <span className="uppercase tracking-wider text-xs">{t('hero.badge')}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                        {t('hero.title_main')} <br />
                        <span className="text-[#FE8C34] relative inline-block">
                            {t('hero.title_highlight')}
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
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 relative">
                        {/* Image with strong shadow */}
                        {/* Yahan se h-full hata diya gaya hai */}
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src="/new images/safety.png"
                                alt="Team hands together"

                                className="w-full h-auto object-contain block"
                            />

                            {/* Blackish shade at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Impact Overlay Card */}
                            <div className="absolute bottom-6 left-8 w-[280px] bg-white/5 backdrop-blur-xs border border-white/20 p-5 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center shrink-0 shadow-sm text-white">
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <p className="font-bold text-white text-base">{t('impact.image_card.certified')}</p>
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed pl-1">
                                    {t('impact.image_card.desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="inline-block mb-4">
                            <span className="text-xs font-bold text-[#1C4A3C] uppercase tracking-widest">{t('impact.badge')}</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-[#0A2920] mb-6 leading-[1.15]">
                            {t('impact.title')}
                        </h2>
                        <p className="text-[#6b7280] mb-12 text-lg leading-relaxed">
                            {t('impact.desc')}
                        </p>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">{t('impact.stats.incidents')}</span>
                                <span className="text-2xl font-bold text-[#0A2920]">&lt; 0.01%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">{t('impact.stats.training')}</span>
                                <span className="text-2xl font-bold text-[#0A2920]">45,000+</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-[#4b5563] font-medium">{t('impact.stats.features')}</span>
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
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('community.title')}</h2>
                        <p className="text-white/60 mb-10 text-lg">
                            {t('community.desc')}
                        </p>
                        <button className="bg-white text-[#0A2920] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center gap-2 hover:gap-3">
                            {t('community.button')}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

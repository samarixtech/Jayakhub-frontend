import React, { ReactNode } from 'react';
import HeroBackground from '@/components/common/public-website/HeroBackground';
import WaveDivider from '@/components/common/public-website/WaveDivider';

interface PublicHeroSectionProps {
    badge: ReactNode;
    title_p1: ReactNode;
    title_highlight: ReactNode;
}

export default function PublicHeroSection({ badge, title_p1, title_highlight }: PublicHeroSectionProps) {
    return (
        <section className="bg-primary pt-20 pb-34 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <HeroBackground />

            <div className="max-w-5xl mx-auto text-center relative">
                <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-white/10">
                    {badge}
                </span>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
                    <span>{title_p1}</span>
                    <span className="text-[#fe8c34] relative mt-2 md:mt-0">
                        {title_highlight}
                        {/* Custom Underline Curve */}
                        <svg
                            viewBox="0 0 300 20"
                            fill="none"
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-auto text-[#fe8c34]"
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

            <WaveDivider />
        </section>
    );
}
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Search, Sparkles, Flame, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export default function Hero() {
    const t = useTranslations('Home');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const STATS = [
        { value: t('stats.customers.value'), label: t('stats.customers.label'), icon: Star, color: 'text-[#fdde31]' },
        { value: t('stats.restaurants.value'), label: t('stats.restaurants.label'), icon: Flame, color: 'text-[#ff3a44]' },
        { value: t('stats.delivery.value'), label: t('stats.delivery.label'), icon: Clock, color: 'text-[#fb923c]' },
    ] as const;

    // Shared transition class for entrance animations
    const entryTransition = (delay: string) =>
        cn("transition-all duration-700",
            delay,
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        );

    return (
        <section id="home" className="relative min-h-screen flex flex-col justify-center pt-16 pb-16 lg:pt-20 lg:pb-10 overflow-hidden bg-primary">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-primary/20 rounded-full blur-[80px] lg:blur-[120px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] bg-orange-500/10 rounded-full blur-[60px] lg:blur-[100px] animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px] lg:[background-size:60px_60px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20 z-10">
                <div className="grid lg:grid-cols-2 gap-y-16 gap-x-8 lg:gap-8 items-center min-h-[calc(100vh-160px)]">

                    {/* Left Content */}
                    <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                        <div className={cn("inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10", entryTransition("delay-0"))}>
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-medium text-white/90">{t('hero_badge')}</span>
                        </div>

                        <h1 className={cn("text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] lg:leading-[1.05] tracking-tight", entryTransition("delay-100"))}>
                            {t('hero_title_p1')}
                            <span className="relative inline-block mx-2 lg:mx-3 text-[#FE8C34]">
                                {t('hero_title_highlight')}
                                <svg className="absolute -bottom-1 lg:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                            <br className="hidden lg:block" />
                            <span className="text-white/90">{t('hero_title_p2')}</span>
                        </h1>

                        <p className={cn("text-base sm:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed", entryTransition("delay-200"))}>
                            {t('hero_subtitle')}
                        </p>

                        {/* Search Bar */}
                        <div className={entryTransition("delay-300")}>
                            <div className="group relative bg-white rounded-2xl p-2 shadow-2xl flex items-center focus-within:ring-4 focus-within:ring-primary/30 transition-all max-w-md mx-auto lg:max-w-none lg:mx-0">
                                <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                                    <Input
                                        placeholder={t('hero_search_placeholder')}
                                        className="border-none shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-12 text-sm sm:text-base px-0"
                                    />
                                </div>
                                <Button size="lg" className="bg-primary hover:bg-primary-light text-white rounded-xl px-5 sm:px-8 font-semibold transition-transform hover:scale-105 shrink-0">
                                    <Search className="w-5 h-5 sm:mr-2" />
                                    <span className="hidden sm:inline">{t('hero_search_btn')}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className={cn("flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-6 pt-4", entryTransition("delay-500"))}>
                            {STATS.map((stat) => (
                                <div key={stat.label} className="flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                                        <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Visuals */}
                    <div className={cn("relative h-[400px] sm:h-[500px] lg:h-[600px] w-full flex justify-center items-center mt-8 lg:mt-0 transition-all duration-1000 delay-300", isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
                        {/* Main Image Container - Responsive sizes */}
                        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px]">
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-[40px] lg:blur-[60px] animate-pulse" />
                                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl animate-float">
                                    <Image src="/DeliciousFood.png" alt="Featured Dish" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                                </div>
                                {/* Ring adjusted to be tighter (-12px on mobile, -16px desktop) */}
                                <div className="absolute inset-[-12px] lg:inset-[-16px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow" />
                            </div>
                        </div>

                        {/* Floating Items - Responsive positioning and scaling */}
                        <FloatingCard
                            img="/Falafel.png" title="Falafel" price="$5.99"
                            className="scale-90 sm:scale-100 top-0 right-0 sm:top-10 sm:right-10"
                        />
                        <FloatingCard
                            img="/Dolma.png" title="Dolma" price="$8.99"
                            className="scale-90 sm:scale-100 bottom-0 left-0 sm:bottom-20 sm:left-10"
                            delay="1s" reverse
                        />
                        <FloatingCard
                            img="/Tabbouleh.png" title="Tabbouleh" price="$4.99"
                            className="scale-90 sm:scale-100 top-1/4 -left-4 sm:top-1/3 sm:-left-5"
                            delay="1.5s"
                        />

                        {/* Review Badge - Responsive positioning and scaling */}
                        <div className="absolute bottom-0 right-0 sm:bottom-10 sm:right-10 scale-90 sm:scale-100 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                    <span className="font-bold text-foreground text-sm">4.9</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">2,500+ reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Wave */}
            <div className="absolute bottom-0 w-full leading-[0]">
                <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC" />
                </svg>
            </div>
        </section>
    );
}

function FloatingCard({ img, title, price, className, delay = '0.5s', reverse = false }: any) {
    return (
        <div
            className={cn("absolute bg-white rounded-2xl p-2 shadow-xl z-20", reverse ? "animate-float-reverse" : "animate-float", className)}
            style={{ animationDelay: delay }}
        >
            <Image src={img} alt={title} width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl" />
            <div className="mt-2 text-center">
                <div className="text-xs font-bold text-foreground">{title}</div>
                <div className="text-[10px] sm:text-xs text-primary font-semibold">{price}</div>
            </div>
        </div>
    );
}
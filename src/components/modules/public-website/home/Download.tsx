import { useEffect, useRef, useState } from 'react';
import { Star, Zap, Gift, Clock } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import mobileAppImg from '../../../../../public/mobileApp.png';

export default function DownloadApp() {
  const t = useTranslations('Home.download_app');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    { icon: Zap, text: t('features.checkout') },
    { icon: Gift, text: t('features.deals') },
    { icon: Clock, text: t('features.tracking') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden min-h-screen flex flex-col justify-center"
    >
      {/* Background Blobs - Scaled for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Phone Mockup - Moved to order-2 on mobile for better flow, order-1 on desktop */}
          <div
            className={`relative flex justify-center order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
          >
            {/* Decorative Pulse Elements */}
            <div className="absolute top-10 left-10 w-16 h-16 md:w-20 md:h-20 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Phone Container */}
            <div className="relative w-full max-w-[260px] md:max-w-xs">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl transform scale-110 animate-pulse" />
              <Image
                src={mobileAppImg}
                alt="Jayak Hub App"
                width={320}
                height={640}
                className="relative z-10 w-full drop-shadow-2xl animate-float"
                style={{ animationDuration: '5s' }}
              />

              {/* Floating Card 1 - Scaled for mobile */}
              <div
                className="absolute -top-4 -right-4 md:-right-8 bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl animate-float z-20"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm md:text-base">4.9 {t('stats.rating_label')}</div>
                    <div className="text-[10px] md:text-sm text-[#64748B]">50K+ {t('stats.reviews_label')}</div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Scaled for mobile */}
              <div
                className="absolute bottom-20 -left-4 md:-left-8 bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl animate-float-reverse z-20"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm md:text-base">30min</div>
                    <div className="text-[10px] md:text-sm text-[#64748B]">{t('stats.avg_delivery_label')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6">
              {t('badge')}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-[1.15]">
              {t('title_prefix')}
              <span className="text-primary"> {t('title_highlight')} </span>
              {t('title_suffix')}
            </h2>

            <p className="text-[#64748B] text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              {t('desc')}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature.text}
                  className={`flex items-center gap-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold text-sm md:text-base">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* App Store Buttons - Stack on mobile, side-by-side on sm+ */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-600 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-3 bg-primary text-white px-6 py-3.5 rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 hover:shadow-xl w-full sm:w-auto"
              >
                <FaApple className="w-8 h-8 " />
                <div className="text-left">
                  <div className="text-[10px] opacity-70 uppercase font-bold tracking-wider">{t('buttons.app_store_sub')}</div>
                  <div className="text-base md:text-lg font-bold -mt-1">{t('buttons.app_store_main')}</div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.jayakhub.customer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-3 bg-primary text-white px-6 py-3.5 rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 hover:shadow-xl w-full sm:w-auto"
              >
                <FaGooglePlay className="w-7 h-7 md:w-8 md:h-8" />
                <div className="text-left">
                  <div className="text-[10px] opacity-70 uppercase font-bold tracking-wider">{t('buttons.google_play_sub')}</div>
                  <div className="text-base md:text-lg font-bold -mt-1">{t('buttons.google_play_main')}</div>
                </div>
              </a>
            </div>

            {/* Stats - Grid layout for better mobile distribution */}
            <div
              className={`grid grid-cols-2 md:flex md:items-center gap-y-8 gap-x-4 md:gap-8 mt-12 pt-8 border-t border-[#E2E8F0] transition-all duration-600 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400" />
                  <span className="text-xl md:text-2xl font-black text-foreground">4.9</span>
                </div>
                <div className="text-[10px] md:text-sm font-bold text-[#94A3B8] uppercase">{t('buttons.app_store_main')}</div>
              </div>

              <div className="hidden md:block w-px h-12 bg-[#E2E8F0]" />

              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400" />
                  <span className="text-xl md:text-2xl font-black text-foreground">4.8</span>
                </div>
                <div className="text-[10px] md:text-sm font-bold text-[#94A3B8] uppercase">{t('buttons.google_play_main')}</div>
              </div>

              <div className="hidden md:block w-px h-12 bg-[#E2E8F0]" />

              <div className="col-span-2 text-center md:text-left">
                <div className="text-xl md:text-2xl font-black text-foreground mb-1">50K+</div>
                <div className="text-[10px] md:text-sm font-bold text-[#94A3B8] uppercase">{t('stats.active_downloads')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
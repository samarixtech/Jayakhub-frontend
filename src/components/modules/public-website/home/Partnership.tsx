import { useEffect, useRef, useState } from 'react';
import { Bike, Store, ArrowRight, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Partner() {
  const t = useTranslations('Home.partnership');
  const [isVisible, setIsVisible] = useState(false);
  const [, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const partnerOptions = [
    {
      id: 1,
      title: t('driver.title'),
      subtitle: t('driver.subtitle'),
      description: t('driver.desc'),
      image: '/partner-delivery.jpg',
      icon: Bike,
      cta: t('driver.cta'),
      benefits: [
        { icon: DollarSign, text: t('driver.benefits.earnings') },
        { icon: TrendingUp, text: t('driver.benefits.payouts') },
        { icon: Users, text: t('driver.benefits.drivers') },
      ],
      gradient: 'from-primary to-emerald-500',
    },
    {
      id: 2,
      title: t('restaurant.title'),
      subtitle: t('restaurant.subtitle'),
      description: t('restaurant.desc'),
      image: '/partner-restaurant.jpg',
      icon: Store,
      cta: t('restaurant.cta'),
      benefits: [
        { icon: TrendingUp, text: t('restaurant.benefits.sales') },
        { icon: Users, text: t('restaurant.benefits.customers') },
        { icon: DollarSign, text: t('restaurant.benefits.rates') },
      ],
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 bg-[#F8FAFC] relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Card Container */}
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-primary/20">

          {/* Background Decorations (Moved inside card) */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
          </div>

          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-700 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/10">
              {t('badge')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t('title_prefix')} <span className="text-accent-yellow">{t('title_highlight')}</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              {t('desc')}
            </p>
          </div>

          {/* Partner Cards */}
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {partnerOptions.map((option, index) => (
              <div
                key={option.id}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-90`} />
                </div>

                {/* Content */}
                <div className="relative p-8 lg:p-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <option.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text */}
                  <div className="text-white/70 text-sm font-medium mb-2">{option.subtitle}</div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{option.title}</h3>
                  <p className="text-white/80 mb-8 max-w-sm">{option.description}</p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-8">
                    {option.benefits.map((benefit) => (
                      <div key={benefit.text} className="flex items-center gap-3 text-white/90">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <benefit.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button className="mt-auto w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 group/btn">
                    {option.cta}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            className={`mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-500 relative z-10 border-t border-white/10 pt-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            {[
              { value: '500+', label: t('stats.drivers') },
              { value: '15+', label: t('stats.restaurants') },
              { value: '50K+', label: t('stats.orders') },
              { value: '8', label: t('stats.cities') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

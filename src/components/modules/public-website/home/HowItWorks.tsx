import { useEffect, useRef, useState } from 'react';
import { MapPin, UtensilsCrossed, Bike, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('Home.how_it_works');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: '01',
      icon: MapPin,
      title: t('steps.step1.title'),
      description: t('steps.step1.desc'),
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
    },
    {
      number: '02',
      icon: UtensilsCrossed,
      title: t('steps.step2.title'),
      description: t('steps.step2.desc'),
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-50',
    },
    {
      number: '03',
      icon: Bike,
      title: t('steps.step3.title'),
      description: t('steps.step3.desc'),
      color: 'from-primary to-emerald-400',
      bgColor: 'bg-emerald-50',
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
    <section ref={sectionRef} className="py-24 bg-[#F8FAFC] relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t('badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t('title_prefix')} <span className="text-primary">{t('title_highlight')}</span>
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#E2E8F0] to-transparent" />
              )}

              <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 ${hoveredStep === index
                ? 'border-primary shadow-xl shadow-primary/10 -translate-y-2'
                : 'border-transparent shadow-lg shadow-black/5'
                }`}>
                {/* Step Number */}
                <div className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 mt-4 transition-transform group-hover:scale-110`}>
                  <step.icon className={`w-8 h-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} style={{ color: index === 0 ? '#3B82F6' : index === 1 ? '#F97316' : '#2F6B4F' }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Learn More */}
                <button className="flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  {t('learn_more')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

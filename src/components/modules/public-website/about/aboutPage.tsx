import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="bg-primary pt-20 pb-34 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-white/10">
            Our Mission
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
            <span>The Engine Behind</span>
            <span className="text-[#fe8c34] relative mt-2 md:mt-0">
              Global Cuisine
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

      {/* ===== FULL WIDTH IMAGE ===== */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className=" rounded-3xl overflow-hidden ">
            <img
              src="/about.png"
              alt="Food delivery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Our Story
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                From Baghdad to <br />the world
              </h2>
            </div>
            <div className="space-y-6 text-lg text-[#64748B] leading-relaxed">
              <p>
                Founded in 2018, JayakHub was born from a simple idea: <strong className="text-foreground">food delivery should be seamless, reliable, and accessible to everyone.</strong>
              </p>
              <p>
                We don't just deliver meals. We connect communities, support local restaurants, and bring people together through the food they love.
              </p>
              <p>
                Today, we're trusted by thousands of restaurants and have delivered millions of orders across Iraq.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '2018', label: 'Founded' },
              { value: '5,000+', label: 'Restaurant partners' },
              { value: '1M+', label: 'Orders delivered' },
              { value: '8', label: 'Cities' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-3">
                  {stat.value}
                </div>
                <div className="text-white/50 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="inline-block bg-accent-yellow/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              What we believe
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Our values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
            {[
              {
                title: 'Make it happen',
                description: 'We move fast and take ownership. If we see a problem, we fix it.',
              },
              {
                title: 'Be open',
                description: 'We communicate honestly and directly. Transparency builds trust.',
              },
              {
                title: 'Think big',
                description: 'We\'re building something that matters. Every decision should reflect that.',
              },
              {
                title: 'Care deeply',
                description: 'About our customers, our partners, our team, and the communities we serve.',
              },
            ].map((value) => (
              <div key={value.title} className="border-t-2 border-accent-yellow pt-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-[#64748B] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR EVERYONE ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
              For everyone
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Join the ecosystem
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'For customers',
                description: 'Get your favorite food delivered fast. Track your order in real-time.',
                cta: 'Order now',
                image: '/burger.jpg',
              },
              {
                title: 'For restaurants',
                description: 'Reach more customers and grow your business with our platform.',
                cta: 'Partner with us',
                image: '/For-restaurants.png',
              },
              {
                title: 'For riders',
                description: 'Earn money on your schedule. Be your own boss.',
                cta: 'Start delivering',
                image: '/For-riders.png',
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-shadow">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-[#64748B] mb-4 leading-relaxed">{item.description}</p>
                <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  {item.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import {
    ArrowRight,
    Smartphone,
    MapPin,
    LayoutDashboard,
    Brain,
    Gift,
    Headphones,
    Zap,
    Shield,
    Server,
    Check,
    Star,
    Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformFeatures = [
    {
        icon: Smartphone,
        title: 'Seamless Customer Journey',
        description: 'Smooth user flow from login to delivery tracking.',
    },
    {
        icon: MapPin,
        title: 'Live Tracking',
        description: 'Real-time GPS updates and smart route optimization.',
    },
    {
        icon: LayoutDashboard,
        title: 'Smart Restaurant Dashboard',
        description: 'Manage menus, orders, and analytics in one place.',
    },
    {
        icon: Brain,
        title: 'AI-Driven Dispatch',
        description: 'Reduce delivery time with predictive driver assignments.',
    },
    {
        icon: Gift,
        title: 'Loyalty & Rewards',
        description: 'Engage users with automatic points and cashback.',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'AI + human support for instant issue resolution.',
    },
];

const whyChooseUs = [
    {
        icon: Zap,
        title: 'Fast APIs',
        description: '200ms average response time globally.',
    },
    {
        icon: Server,
        title: '99.9% Uptime',
        description: 'Redundant servers for seamless experience.',
    },
    {
        icon: Shield,
        title: 'Secure Infrastructure',
        description: 'End-to-end encryption and fraud detection.',
    },
];

const pricingPlans = [
    {
        name: 'Starter',
        price: 'Free',
        period: '',
        features: ['Basic analytics', 'Live tracking', 'Email support'],
        popular: false,
    },
    {
        name: 'Pro',
        price: '$49',
        period: '/mo',
        features: ['Loyalty system', 'Priority support', 'Advanced dashboard'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: ['Dedicated servers', '24/7 SLA', 'Custom branding'],
        popular: false,
    },
];

const testimonials = [
    {
        quote: 'The JAYAK HUB platform streamlined our operations instantly. Super intuitive!',
        name: 'Alex Johnson',
        role: 'CEO, QuickBites Inc.',
    },
    {
        quote: "Incredible speed and uptime. We've never missed a delivery window.",
        name: 'Maria Gomez',
        role: 'CFO, Foodie Hub',
    },
    {
        quote: 'The analytics dashboard is a game-changer for our business decisions.',
        name: 'Rahul Singh',
        role: 'Owner, Spice Route',
    },
];

export default function Services() {
    const [isVisible, setIsVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
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
            <section className="bg-primary pt-20 pb-34 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                        Our Services
                    </span>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
                        <span>Delivering Innovation</span>
                        <span className="text-[#fe8c34] relative mt-2 md:mt-0">
                            at Every Step
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

            {/* ===== STATS ===== */}
            <section ref={statsRef} className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { value: '200K+', label: 'Active Users' },
                            { value: '120K+', label: 'Deliveries/month' },
                            { value: '9K+', label: 'Partner Restaurants' },
                            { value: '4.9★', label: 'User Rating' },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-[#64748B]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PLATFORM FEATURES ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                            Our Platform
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            Smarter Solutions for Modern Delivery
                        </h2>
                        <p className="text-lg text-[#64748B]">
                            Empowering logistics with automation and clarity across all touchpoints.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {platformFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg hover:border-primary/20 transition-all"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY CHOOSE US ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-accent-yellow/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                            Built for Performance and Trust
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {whyChooseUs.map((item) => (
                            <div key={item.title} className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                                <p className="text-[#64748B]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-white/10 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
                            Pricing
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Flexible Plans for Every Team
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto">
                            Choose the plan that fits your needs and scale your delivery operations effortlessly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {pricingPlans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-3xl p-8 ${plan.popular
                                    ? 'bg-white shadow-2xl scale-105'
                                    : 'bg-white/10 backdrop-blur-sm border border-white/10'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="inline-block bg-accent-yellow text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-foreground' : 'text-white'}`}>
                                    {plan.name}
                                </h3>
                                <div className={`text-4xl font-bold mb-6 ${plan.popular ? 'text-primary' : 'text-white'}`}>
                                    {plan.price}
                                    <span className={`text-lg font-normal ${plan.popular ? 'text-[#64748B]' : 'text-white/60'}`}>
                                        {plan.period}
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className={`flex items-center gap-3 ${plan.popular ? 'text-[#64748B]' : 'text-white/70'}`}>
                                            <Check className={`w-5 h-5 ${plan.popular ? 'text-primary' : 'text-accent-yellow'}`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full py-6 rounded-full font-semibold ${plan.popular
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    Choose Plan
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                            Testimonials
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-[#64748B]">
                            Trusted by thousands of restaurants and logistics partners worldwide.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.name} className="bg-white rounded-3xl p-8 shadow-sm">
                                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                                <p className="text-[#64748B] mb-6 leading-relaxed">"{testimonial.quote}"</p>
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-[#64748B]">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-yellow/10 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your <br />
                                <span className="text-accent-yellow">Delivery Business?</span>
                            </h2>
                            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                                Join the growing community of businesses optimizing their delivery operations with JayakHub.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:gap-3"
                            >
                                Contact Sales
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import {
    ArrowRight,
    TrendingUp,
    Users,
    Smartphone,
    BarChart3,
    Clock,
    HeadphonesIcon,
    Package,
    Check,
    Quote,
    Utensils,
    Zap,
    Shield,
    Star,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
    { value: '5,000+', label: 'Restaurant Partners' },
    { value: '30%', label: 'Avg Revenue Increase' },
    { value: '1M+', label: 'Orders Delivered' },
    { value: '4.8★', label: 'Partner Rating' },
];

const benefits = [
    {
        icon: TrendingUp,
        title: 'Increase Your Revenue',
        description: 'Reach thousands of new customers and boost your sales by up to 30% with our platform.',
    },
    {
        icon: Users,
        title: 'Expand Your Reach',
        description: 'Get discovered by hungry customers in your area looking for great food.',
    },
    {
        icon: LayoutDashboard,
        title: 'Easy-to-Use Dashboard',
        description: 'Manage orders, menus, and analytics from one intuitive restaurant portal.',
    },
    {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description: 'Track performance, understand trends, and make data-driven decisions.',
    },
    {
        icon: Clock,
        title: 'Flexible Hours',
        description: 'Set your own delivery hours and availability. You\'re in control.',
    },
    {
        icon: HeadphonesIcon,
        title: 'Dedicated Support',
        description: '24/7 partner support team ready to help you grow your business.',
    },
];

const howItWorks = [
    {
        step: 1,
        title: 'Sign Up',
        description: 'Fill out our simple registration form and tell us about your restaurant.',
        image: '/restaurant-1.jpg'
    },
    {
        step: 2,
        title: 'Get Approved',
        description: 'Our team reviews your application and gets you onboarded within 48 hours.',
        image: '/restaurant-2.jpg'
    },
    {
        step: 3,
        title: 'Set Up Your Menu',
        description: 'Add your dishes, set prices, and customize your restaurant profile.',
        image: '/hero-food-main.jpg'
    },
    {
        step: 4,
        title: 'Start Receiving Orders',
        description: 'Go live and start accepting orders from customers in your area.',
        image: '/hero-food-3.png'
    },
];

const testimonials = [
    {
        quote: 'Joining JayakHub was the best decision for my restaurant. Our delivery orders tripled in the first month!',
        name: 'Ahmed Hassan',
        role: 'Owner, Al-Rasheed Restaurant',
        avatar: 'AH',
    },
    {
        quote: 'The dashboard is incredibly easy to use. I can manage everything from my phone while cooking.',
        name: 'Sara Al-Mousa',
        role: 'Chef, Mama\'s Kitchen',
        avatar: 'SM',
    },
    {
        quote: 'Their support team is amazing. They helped us optimize our menu and increase our average order value.',
        name: 'Omar Khalil',
        role: 'Manager, Grill House',
        avatar: 'OK',
    },
];

const pricingFeatures = [
    'No upfront costs',
    'Pay only for completed orders',
    'Free marketing & promotions',
    'Free tablet for order management',
    'Weekly payments',
    'Dedicated account manager',
];

export default function Partners() {
    const [isVisible, setIsVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsVisible(true);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* ===== HERO SECTION ===== */}
            <section className="bg-[#0B5D4E] pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F5A623]/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-sm font-semibold text-white mb-8">
                                <span className="uppercase tracking-wider text-xs">For Restaurant Owners</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                                Grow your <br />
                                restaurant with <br />
                                <span className="text-[#FE8C34] relative inline-block">
                                    Jayak Hub
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FE8C34]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7954 3.73711 96.0963 -1.2294 197.906 5.64571" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                </span>
                            </h1>

                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Button className="bg-white text-[#0B5D4E] hover:bg-white/90 h-14 px-8 rounded-full text-lg font-bold transition-transform hover:scale-105">
                                    Become a Partner
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full text-lg font-semibold bg-transparent">
                                    Learn More
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm font-medium text-white/80">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#F5A623]" />
                                    <span>30% avg sales boost</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#F5A623]" />
                                    <span>Marketing support included</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="/partner-hero.jpg"
                                    alt="Chef in kitchen"
                                    className="w-full h-auto object-cover scale-105"
                                />
                                {/* Floating Badge */}
                                <div className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float">
                                    <div className="w-10 h-10 rounded-full bg-[#E8F4F1] flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-[#0B5D4E]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Growth</div>
                                        <div className="text-lg font-bold text-[#0B5D4E]">+30% Sales</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pointer-events-none">
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 lg:p-10 pointer-events-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100" ref={statsRef}>
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`text-center space-y-2 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl lg:text-5xl font-bold text-[#0B5D4E]">{stat.value}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== DASHBOARD SHOWCASE SECTION ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-lg mx-auto lg:max-w-none rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img src="/partner-image2.jpg" alt="Restaurant Dashboard" className="w-full object-cover" />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="font-bold text-xl mb-1">Live Analytics</div>
                                    <div className="text-sm opacity-80">Track orders in real-time</div>
                                </div>
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10" />
                        </div>

                        <div className="order-1 lg:order-2">
                            <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">Partner Dashboard</span>
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Built for restaurant owners</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Manage your entire delivery business from a single powerful dashboard. Accept orders, update menus, and track sales effortlessly.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Instant order notifications',
                                    'Menu management tools',
                                    'Sales & revenue reports',
                                    'Customer feedback insights'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-accent-orange/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-accent-orange" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <Button className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 rounded-xl shadow-lg">
                                    Demo the Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== BENEFITS ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-16 mx-auto text-center">
                        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                            Why Partner With Us
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#0f172a] mb-4 md:whitespace-nowrap">
                            Why Partner with <span className="text-primary">JayakHub?</span>
                        </h2>
                        <p className="text-lg text-[#64748B]">
                            We provide the tools and support you need to take your restaurant to the next level
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg hover:border-primary/20 transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <benefit.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                                <p className="text-[#64748B] text-sm leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS (Redesigned) ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Get started in 4 steps
                        </h2>
                        <p className="text-lg text-[#64748B]">
                            Join thousands of successful restaurant partners today.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: 'Sign Up',
                                desc: 'Fill out our simple registration form and tell us about your restaurant.',
                                img: '/gourmet.jpg'
                            },
                            {
                                title: 'Get Approved',
                                desc: 'Our team reviews your application and gets you onboarded within 48 hours.',
                                img: '/baghdad-bites.jpg'
                            },
                            {
                                title: 'Set Up Your Menu',
                                desc: 'Add your dishes, set prices, and customize your restaurant profile.',
                                img: '/mixed-grill.jpg'
                            },
                            {
                                title: 'Start Receiving Orders',
                                desc: 'Go live and start accepting orders from customers in your area.',
                                img: '/partner-image2.jpg'
                            }
                        ].map((step, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="aspect-square rounded-[1.5rem] overflow-hidden relative mb-6">
                                    <img
                                        src={step.img}
                                        alt={step.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Step Indicator */}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                                        <span className="font-bold text-slate-900">{i + 1}</span>
                                    </div>
                                </div>
                                <div className="px-2 pb-2">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">

                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Partner Success Stories
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.name} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                                <p className="text-[#64748B] mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-[#64748B]">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-yellow/10 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to grow your <br />
                                <span className="text-accent-yellow">restaurant business?</span>
                            </h2>
                            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                                Join the JayakHub family today and start reaching thousands of hungry customers in your area.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl">
                                    Apply Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <Button className="bg-white/10 text-white hover:bg-white/20 px-8 py-6 rounded-full font-semibold text-lg transition-all border border-white/20">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


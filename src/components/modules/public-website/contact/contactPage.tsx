import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="bg-white">
            {/* ===== HERO ===== */}
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
                        Contact Us
                    </span>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
                        <span>We'd love to</span>
                        <span className="text-[#fe8c34] relative mt-2 md:mt-0">
                            hear from you.
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
            {/* ===== CONTACT GRID ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Left: Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-8">Get in touch</h2>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground mb-1">Chat to us</h3>
                                            <p className="text-[#64748B] mb-2">Our friendly team is here to help.</p>
                                            <a href="mailto:support@jayakhub.com" className="text-primary font-semibold hover:underline">support@jayakhub.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground mb-1">Visit us</h3>
                                            <p className="text-[#64748B] mb-2">Come say hello at our HQ.</p>
                                            <address className="text-primary font-semibold not-italic">
                                                320 Decker Suite 100,<br />
                                                Irving Texas 75062
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground mb-1">Call us</h3>
                                            <p className="text-[#64748B] mb-2">Mon-Fri from 8am to 6pm.</p>
                                            <a href="tel:+14694225944" className="text-primary font-semibold hover:underline">+1 (469) 422-5944</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-[#E2E8F0]">
                                <h3 className="font-bold text-foreground mb-2">Frequently asked questions</h3>
                                <p className="text-[#64748B] mb-4">Find answers to common questions about delivery, payments, and account management.</p>
                                <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                                    Visit Help Center <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[#E2E8F0] shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
                                <p className="text-[#64748B]">We usually respond within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-foreground">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-foreground">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-foreground">Message</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        placeholder="How can we help?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-primary text-white hover:bg-primary/90 py-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

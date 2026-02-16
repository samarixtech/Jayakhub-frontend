import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Contact() {
    const t = useTranslations('Contact');
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
        <div className="bg-[#FAFAFA] min-h-screen">
            {/* ===== HERO ===== */}
            <section className="bg-[#0B5D4E] pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F5A623]/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 text-sm font-semibold text-white mb-8">
                            <span className="uppercase tracking-wider text-xs">{t('hero.badge')}</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                            {t('hero.title_p1')} <br />
                            <span className="text-[#F5A623] relative inline-block">
                                {t('hero.title_highlight')}
                                {/* Custom Underline Curve */}
                                <svg
                                    viewBox="0 0 300 20"
                                    fill="none"
                                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-auto text-[#F5A623]"
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
                </div>
            </section>

            {/* ===== CONTACT CARD ===== */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pointer-events-none pb-24">
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 lg:p-12 pointer-events-auto border border-gray-100">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Left: Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-8">{t('info.title')}</h2>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <Mail className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.chat.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.chat.desc')}</p>
                                            <a href="mailto:support@jayakhub.com" className="text-[#0B5D4E] font-semibold hover:underline">support@jayakhub.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <MapPin className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.visit.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.visit.desc')}</p>
                                            <address className="text-[#0B5D4E] font-semibold not-italic">
                                                {t.rich('info.visit.address', {
                                                    br: () => <br />
                                                })}
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#FAFAFA] rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                            <Phone className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.call.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.call.desc')}</p>
                                            <a href="tel:+14694225944" className="text-[#0B5D4E] font-semibold hover:underline">+1 (469) 422-5944</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-[#E2E8F0]">
                                <h3 className="font-bold text-slate-900 mb-2">{t('faq.title')}</h3>
                                <p className="text-[#64748B] mb-4">{t('faq.desc')}</p>
                                <a href="#" className="inline-flex items-center gap-2 text-[#0B5D4E] font-semibold hover:gap-3 transition-all">
                                    {t('faq.link')} <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('form.title')}</h2>
                                <p className="text-[#64748B]">{t('form.desc')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">{t('form.labels.name')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder={t('form.placeholders.name')}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all bg-[#F8FAFC]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-slate-700">{t('form.labels.email')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder={t('form.placeholders.email')}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all bg-[#F8FAFC]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-slate-700">{t('form.labels.message')}</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        placeholder={t('form.placeholders.message')}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all resize-none bg-[#F8FAFC]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#0B5D4E] text-white hover:bg-[#0B5D4E]/90 py-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    <Send className="w-5 h-5" />
                                    {t('form.submit_button')}
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import PublicHeroSection from '@/components/common/public-website/publicHeroSection';

export default function Contact() {
    const t = useTranslations('Contact');
    const locale = useLocale();
    const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
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
        
    };

    return (
        <div className="bg-white min-h-screen">
            {/* ===== HERO ===== */}
            <PublicHeroSection
                badge={t('hero.badge')}
                title_p1={t('hero.title_p1')}
                title_highlight={t('hero.title_highlight')}
            />

            {/* ===== CONTACT CONTENT ===== */}
            <div className="px-4 sm:px-6 lg:px-8 py-20 pb-32">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                        {/* Left: Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-8">{t('info.title')}</h2>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                                            <Mail className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.chat.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.chat.desc')}</p>
                                            <a href="mailto:support@jayakhub.com" className="text-slate-900 font-bold hover:underline">support@jayakhub.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                                            <MapPin className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.visit.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.visit.desc')}</p>
                                            <address dir="ltr" className="text-slate-900 font-bold not-italic leading-relaxed">
                                                {t.rich('info.visit.address', {
                                                    br: () => <br />
                                                })}
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                                            <Phone className="w-5 h-5 text-[#0B5D4E]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">{t('info.call.title')}</h3>
                                            <p className="text-[#64748B] mb-2">{t('info.call.desc')}</p>
                                            <a dir="ltr" href="tel:+14694225944" className="text-slate-900 font-bold hover:underline inline-block">+1 (469) 422-5944</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100/50">
                                <h3 className="font-bold text-slate-900 mb-2">{t('faq.title')}</h3>
                                <p className="text-[#64748B] mb-6 text-sm leading-relaxed">{t('faq.desc')}</p>
                                <Link href="/help" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all text-sm">
                                    {t('faq.link')} <Arrow className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Right: Form Card */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 sticky top-24">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('form.title')}</h2>
                                <p className="text-[#64748B] text-sm">{t('form.desc')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t('form.labels.name')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder={t('form.placeholders.name')}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all bg-white text-sm placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t('form.labels.email')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder={t('form.placeholders.email')}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all bg-white text-sm placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t('form.labels.message')}</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        placeholder={t('form.placeholders.message')}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D4E]/20 focus:border-[#0B5D4E] transition-all resize-none bg-white text-sm placeholder:text-gray-400"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#1A4D2E] hover:bg-[#143d24] text-white py-6 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1A4D2E]/20"
                                >
                                    <Send className={`w-4 h-4 ${locale === "ar" ? "scale-x-[-1]" : ""}`} />
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

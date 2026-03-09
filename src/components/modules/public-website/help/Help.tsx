
import React, { useState } from 'react';
import { Search, Package, ArrowRight, ChevronDown, ChevronUp, MessageCircle, Mail, CreditCard, User, Shield, Truck, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import HeroBackground from '@/components/common/public-website/HeroBackground';
import WaveDivider from '@/components/common/public-website/WaveDivider';

// Help categories data


export default function Help() {
    const t = useTranslations('Help');

    const categories = [
        { id: 'orders', name: t('categories.orders.name'), icon: Package, description: t('categories.orders.desc') },
        { id: 'payments', name: t('categories.payments.name'), icon: CreditCard, description: t('categories.payments.desc') },
        { id: 'account', name: t('categories.account.name'), icon: User, description: t('categories.account.desc') },
        { id: 'safety', name: t('categories.safety.name'), icon: Shield, description: t('categories.safety.desc') },
        { id: 'delivery', name: t('categories.delivery.name'), icon: Truck, description: t('categories.delivery.desc') },
        { id: 'partnering', name: t('categories.partnering.name'), icon: Layers, description: t('categories.partnering.desc') },
    ];

    const faqs = [
        {
            id: 'where-is-my-order',
            question: t('faq.items.where_is_my_order.question'),
            answer: t('faq.items.where_is_my_order.answer')
        },
        {
            id: 'can-i-cancel',
            question: t('faq.items.can_i_cancel.question'),
            answer: t('faq.items.can_i_cancel.answer')
        },
        {
            id: 'missing-items',
            question: t('faq.items.missing_items.question'),
            answer: t('faq.items.missing_items.answer')
        }
    ];
    const [activeCategory, setActiveCategory] = useState('orders');
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section className="bg-primary pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <HeroBackground />

                <div className="max-w-3xl mx-auto z-10 relative text-center">
                    <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-white text-sm font-medium">{t('hero.badge')}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">{t('hero.title')}</h1>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto bg-white rounded-full shadow-xl flex items-center p-2">
                        <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
                        <input
                            type="text"
                            placeholder={t('hero.search_placeholder')}
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 h-full py-2"
                        />
                        <button className="bg-[#1C4A3C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#15382d] transition-colors">
                            {t('hero.search_button')}
                        </button>
                    </div>
                </div>


                <WaveDivider />
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
                {/* Heading for Mobile/Categories */}
                <div className="mb-6 lg:hidden">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">{t('sidebar.title')}</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Browse Categories */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-32 h-fit space-y-2">
                            <h2 className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-4">{t('sidebar.title')}</h2>

                            <div className="bg-white rounded-2xl overflow-hidden p-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${activeCategory === category.id
                                            ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100'
                                            : 'hover:bg-gray-50 text-gray-500'
                                            }`}
                                    >
                                        <category.icon className={`w-5 h-5 ${activeCategory === category.id ? 'text-[#0B5D4E]' : 'text-gray-400'}`} />
                                        <div className="flex-1">
                                            <h3 className={`font-medium text-sm ${activeCategory === category.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                {category.description}
                                            </p>
                                        </div>
                                        {activeCategory === category.id && <ArrowRight className="w-4 h-4 text-[#0B5D4E]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-8">
                        {/* Selected Category Header */}
                        <div className="bg-white rounded-[2rem] p-8 flex items-start gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#E8F4F1] flex items-center justify-center flex-shrink-0">
                                <currentCategory.icon className="w-6 h-6 text-[#0B5D4E]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h2>
                                <p className="text-gray-500 mt-1">{currentCategory.description}</p>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">{t('faq.title')}</h3>

                            <div className="space-y-4">
                                {faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-colors">
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full flex items-center justify-between p-6 text-left"
                                        >
                                            <span className="font-semibold text-gray-900">{faq.question}</span>
                                            {openFaq === faq.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {openFaq === faq.id && (
                                            <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50/50 mt-2">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Support Box */}
                        <div className="bg-gray-50 rounded-[2rem] p-8 md:p-12 text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.title')}</h3>
                            <p className="text-gray-500 mb-8">{t('contact.subtitle')}</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#0B5D4E] hover:text-[#0B5D4E] transition-all shadow-sm w-full sm:w-auto justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                    {t('contact.chat')}
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#0B5D4E] hover:text-[#0B5D4E] transition-all shadow-sm w-full sm:w-auto justify-center">
                                    <Mail className="w-5 h-5" />
                                    {t('contact.email')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


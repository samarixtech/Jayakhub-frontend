
import React, { useState } from 'react';
import { Search, Package, ArrowRight, ChevronDown, ChevronUp, MessageCircle, Mail, CreditCard, User, Shield, Truck, Layers } from 'lucide-react';

// Help categories data
const categories = [
    { id: 'orders', name: 'Orders', icon: Package, description: 'Track, cancel, or report issues.' },
    { id: 'payments', name: 'Payments', icon: CreditCard, description: 'Refunds, methods, and charges.' },
    { id: 'account', name: 'Account', icon: User, description: 'Profile, login, and settings.' },
    { id: 'safety', name: 'Safety', icon: Shield, description: 'Standards, reporting, and trust.' },
    { id: 'delivery', name: 'Delivery', icon: Truck, description: 'Fees, times, and areas.' },
    { id: 'partnering', name: 'Partnering', icon: Layers, description: 'For restaurants and stores.' },
];

const faqs = [
    {
        id: 'where-is-my-order',
        question: 'Where is my order?',
        answer: 'You can track your order in real-time through the "My Orders" section in your account. Alternatively, use the tracking link sent to your email.'
    },
    {
        id: 'can-i-cancel',
        question: 'Can I cancel my order?',
        answer: 'Yes, you can cancel your order within 5 minutes of placing it without any charges. After that, cancellation availability depends on the restaurant preparation status.'
    },
    {
        id: 'missing-items',
        question: 'My order is missing items.',
        answer: 'We apologize for the inconvenience. Please report the missing items through the "Help" section in your order details page, and we will process a refund or replacement immediately.'
    }
];

export default function Help() {
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
                {/* Background elements (same as Terms) */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FE8C34]/10 rounded-full blur-[100px]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="max-w-3xl mx-auto z-10 relative text-center">
                    <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-white text-sm font-medium">Support Center</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">How can we help you today?</h1>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto bg-white rounded-full shadow-xl flex items-center p-2">
                        <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 h-full py-2"
                        />
                        <button className="bg-[#1C4A3C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#15382d] transition-colors">
                            Search
                        </button>
                    </div>
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
                {/* Heading for Mobile/Categories */}
                <div className="mb-6 lg:hidden">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">Browse Categories</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Browse Categories */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-32 h-fit space-y-2">
                            <h2 className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-4">Browse Categories</h2>

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
                            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>

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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Did not find what you were looking for?</h3>
                            <p className="text-gray-500 mb-8">Our support team is just a click away.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#0B5D4E] hover:text-[#0B5D4E] transition-all shadow-sm w-full sm:w-auto justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                    Chat with us
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#0B5D4E] hover:text-[#0B5D4E] transition-all shadow-sm w-full sm:w-auto justify-center">
                                    <Mail className="w-5 h-5" />
                                    Email Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


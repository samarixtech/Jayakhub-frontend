import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import HeroBackground from '@/components/common/public-website/HeroBackground';
import WaveDivider from '@/components/common/public-website/WaveDivider';

interface Section {
    id: string;
    title: string;
    content: ReactNode;
}

interface LegalPageTemplateProps {
    pageTitle: string;
    lastUpdated: string;
    icon: React.ElementType;
    alertText: string;
    sections: Section[];
    breadcrumbsText: string;
    tocTitle: string;
    needAssistanceText: string;
    contactSupportText: string;
}

export default function LegalPageTemplate({
    pageTitle,
    lastUpdated,
    icon: Icon,
    alertText,
    sections,
    breadcrumbsText,
    tocTitle,
    needAssistanceText,
    contactSupportText
}: LegalPageTemplateProps) {
    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Header Section */}
            <section className="bg-primary pt-32 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <HeroBackground />

                <div className="max-w-7xl mx-auto z-10 relative">
                    <nav className="flex items-center text-sm text-white/70 mb-8 space-x-2">
                        <span>Legal</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white font-medium">{breadcrumbsText}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10 shadow-lg">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">{pageTitle}</h1>
                            <p className="text-white/70 flex items-center gap-2 text-sm">
                                <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                                    <span className="text-[10px] font-serif italic">i</span>
                                </span>
                                {lastUpdated}
                            </p>
                        </div>
                    </div>
                </div>

                <WaveDivider />
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start relative">

                    {/* Sidebar - Table of Contents */}
                    <div
                        className="w-full lg:w-80 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 h-fit self-start z-40"
                        style={{ position: 'sticky', top: '100px' }}
                    >
                        <div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{tocTitle}</h2>
                            <nav className="space-y-1">
                                {(sections || []).map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        onClick={(e) => scrollToSection(section.id, e)}
                                        className="block text-sm text-gray-600 hover:text-[#0B5D4E] hover:bg-[#0B5D4E]/5 px-4 py-3 rounded-lg transition-colors font-medium border-l-2 border-transparent hover:border-[#0B5D4E]"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-10 pt-10 border-t border-gray-200">
                                <p className="text-xs text-gray-400 mb-2">{needAssistanceText}</p>
                                <a href="/contact" className="text-sm font-bold text-[#1C4A3C] hover:underline">
                                    {contactSupportText}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {/* Alert Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10">
                            <p className="text-sm text-[#1E40AF] font-medium text-center">
                                {alertText}
                            </p>
                        </div>

                        <div className="space-y-12 max-w-3xl">
                            {(sections || []).map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-32">
                                    <h2 className="text-2xl font-bold text-[#0a2920] mb-4">{section.title}</h2>
                                    <p className="text-[#0a2920] leading-relaxed text-lg whitespace-pre-wrap">
                                        {section.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

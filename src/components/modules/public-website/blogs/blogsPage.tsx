import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { articles, featuredArticle } from '@/lib/data/blogs';

export default function Newsroom() {
    const params = useParams();
    const { country, language } = params;

    const getBlogUrl = (slug: string) => `/${country}/${language}/blogs/${slug}`;

    return (
        <div className="bg-white">
            {/* ===== HERO HEADLINE ===== */}
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


                    {/* Top Label - Size matched to reference code (text-sm) */}
                    <span className="inline-block bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-white/10">
                        The Journal
                    </span>

                    {/* Main Heading - Scaled down to match reference (text-5xl to lg:text-7xl) */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 flex flex-col items-center">
                        <span>Thinking</span>
                        <span className="text-[#fe8c34] relative mt-2 md:mt-0">
                            Forward
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

            {/* ===== FEATURED ARTICLE ===== */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
                <div className="max-w-7xl mx-auto">
                    <Link href={getBlogUrl(featuredArticle.slug)} className="group grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Side */}
                        <div className="aspect-[4/3] lg:aspect-square bg-[#F1F5F9] rounded-3xl overflow-hidden relative border border-black/5">
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Content Side */}
                        <div className="lg:pr-12">
                            <div className="flex items-center gap-4 text-sm font-semibold mb-6">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{featuredArticle.category}</span>
                                <span className="text-[#94A3B8] flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {featuredArticle.readTime}
                                </span>
                            </div>

                            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                                {featuredArticle.title}
                            </h2>
                            <p className="text-xl text-[#64748B] leading-relaxed mb-8">
                                {featuredArticle.excerpt}
                            </p>

                            <div className="flex items-center gap-2 text-foreground font-bold group-hover:gap-4 transition-all">
                                Read the story <ArrowRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ===== CATEGORY TABS (Visual) ===== */}
            <section className="pt-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto pb-4 border-b border-black/5 no-scrollbar">
                    {['All Stories', 'Technology', 'Culture', 'Business', 'Drivers'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`whitespace-nowrap text-lg font-bold pb-4 border-b-2 transition-colors ${i === 0 ? 'text-foreground border-primary' : 'text-[#94A3B8] border-transparent hover:text-foreground'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </section>

            {/* ===== ARTICLES GRID ===== */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {articles.map((article, index) => (
                            <Link
                                href={getBlogUrl(article.slug)}
                                key={index}
                                className="group flex flex-col h-full"
                            >
                                <div className="aspect-[3/2] bg-[#FAFAFA] rounded-2xl overflow-hidden mb-6 border border-black/5 relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                                        {article.category}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-[#64748B] mb-4 line-clamp-2 leading-relaxed">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5">
                                    <span className="text-sm font-semibold text-[#94A3B8]">{article.date}</span>
                                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Read</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <button className="px-10 py-5 bg-[#F8FAFC] rounded-full font-bold text-foreground hover:bg-[#F1F5F9] transition-colors">
                            View Archive
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { articles, featuredArticle } from '@/lib/data/blogs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import PublicHeroSection from '@/components/common/public-website/publicHeroSection';

export default function Newsroom() {
    const t = useTranslations('Newsroom');
    const params = useParams();
    const { country, language } = params;

    const getBlogUrl = (slug: string) => `/${country}/${language}/blogs/${slug}`;

    const categories = [
        t('categories.all'),
        t('categories.technology'),
        t('categories.culture'),
        t('categories.business'),
        t('categories.drivers'),
    ];

    return (
        <div className="bg-white">
            {/* ===== HERO HEADLINE ===== */}
            <PublicHeroSection
                badge={t('hero.badge')}
                title_p1={t('hero.title_p1')}
                title_highlight={t('hero.title_highlight')}
            />

            {/* ===== FEATURED ARTICLE ===== */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
                <div className="max-w-7xl mx-auto">
                    <Link href={getBlogUrl(featuredArticle.slug)} className="group grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Side */}
                        <div className="aspect-[4/3] lg:aspect-square bg-[#F1F5F9] rounded-3xl overflow-hidden relative border border-black/5">
                            <Image
                                width={250}
                                height={250}
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
                                {t('featured.read_story')} <ArrowRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ===== CATEGORY TABS (Visual) ===== */}
            <section className="pt-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto pb-4 border-b border-black/5 no-scrollbar">
                    {categories.map((tab, i) => (
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
                                    <Image
                                        width={250}
                                        height={250}
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
                                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t('article.read')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <button className="px-10 py-5 bg-[#F8FAFC] rounded-full font-bold text-foreground hover:bg-[#F1F5F9] transition-colors">
                            {t('archive_btn')}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

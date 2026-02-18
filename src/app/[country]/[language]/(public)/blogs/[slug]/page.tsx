"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { articles, featuredArticle } from "@/lib/data/blogs";
import Link from "next/link";
import Image from "next/image";

export default function BlogPostPage() {
    const params = useParams();
    const { country, language, slug } = params;

    // Combine all posts to find the current one
    const allPosts = [featuredArticle, ...articles];
    const post = allPosts.find((p) => p.slug === slug);

    // Get related articles (excluding current one), take first 3
    const relatedArticles = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    const backLink = `/${country}/${language}/blogs`;

    return (
        <div className="bg-white">
            {/* ===== HERO ===== */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link href={backLink} className="inline-flex items-center text-[#94A3B8] hover:text-primary mb-8 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <div className="flex items-center gap-4 text-sm font-semibold mb-6">
                    <span className="text-primary bg-primary/5 px-3 py-1 rounded-full">{post.category}</span>
                    <div className="flex items-center text-[#94A3B8]">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                    </div>
                    <div className="flex items-center text-[#94A3B8]">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
                    {post.title}
                </h1>

                <p className="text-xl sm:text-2xl text-[#64748B] leading-relaxed">
                    {post.excerpt}
                </p>
            </section>

            {/* ===== FEATURED IMAGE ===== */}
            <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm relative">
                    <Image
                        width={250}
                        height={250}
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <section className="px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-3xl mx-auto">

                    {/* Social Share (Inline) */}
                    <div className="flex items-center gap-4 mb-12 border-b border-[#E2E8F0] pb-8">
                        <span className="text-sm font-bold text-foreground">Share this article:</span>
                        <button className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#1DA1F2] hover:text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#4267B2] hover:text-white transition-colors">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#0077B5] hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-[#E2E8F0] mx-2" />
                        <button className="flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                            Copy Link
                        </button>
                    </div>

                    <div
                        className="prose prose-lg prose-slate max-w-none text-[#334155] leading-loose"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags (Mocked for now as we don't have tags in data yet) */}
                    <div className="mt-16 pt-8 border-t border-[#E2E8F0]">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-2 bg-[#F1F5F9] rounded-lg text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer">Artificial Intelligence</span>
                            <span className="px-4 py-2 bg-[#F1F5F9] rounded-lg text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer">Logistics</span>
                            <span className="px-4 py-2 bg-[#F1F5F9] rounded-lg text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer">Product Updates</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== RELATED ARTICLES ===== */}
            <section className="py-24 bg-[#FAFAFA] border-t border-[#E2E8F0] px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-foreground mb-12">Read next</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedArticles.map((article, index) => (
                            <Link href={`/${country}/${language}/blogs/${article.slug}`} key={index} className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-white rounded-2xl mb-4 border border-[#E2E8F0] overflow-hidden relative">
                                    <Image src={article.image} width={200} height={200} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <div className="text-sm text-[#94A3B8] mt-2">{article.date} • {article.readTime}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

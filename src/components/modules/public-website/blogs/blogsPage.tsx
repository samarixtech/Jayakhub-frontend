"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import PublicHeroSection from "@/components/common/public-website/publicHeroSection";
import type { ApiBlogPost } from "@/app/actions/public/blog";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getExcerpt(html: string, maxLen = 150): string {
  const text = stripHtml(html);
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

function estimateReadTime(html: string): string {
  const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(wordCount / 200))} min read`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  blogs?: ApiBlogPost[];
  categories?: string[];
};

const ALL = "all";

export default function Newsroom({ blogs = [], categories = [] }: Props) {
  const t = useTranslations("Newsroom");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const getBlogUrl = (slug: string) => `/blogs/${slug}`;

  const tabs = [t("categories.all"), ...categories];

  const isFiltered = activeCategory !== ALL;

  const filtered = isFiltered
    ? blogs.filter((b) => b.category === activeCategory)
    : blogs;

  const featured = isFiltered ? null : (filtered[0] ?? null);
  const articleList = isFiltered ? filtered : filtered.slice(1);

  return (
    <div className="bg-white">
      {/* ===== HERO HEADLINE ===== */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

      {/* ===== FEATURED ARTICLE ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          {featured && (
            <Link
              href={getBlogUrl(featured.slug)}
              className="group grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="aspect-4/3 lg:aspect-square bg-[#F1F5F9] rounded-3xl overflow-hidden relative border border-black/5">
                <Image
                  width={600}
                  height={600}
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:pr-12">
                <div className="flex items-center gap-4 text-sm font-semibold mb-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                  <span className="text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {estimateReadTime(featured.content)}
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-xl text-[#64748B] leading-relaxed mb-8">
                  {getExcerpt(featured.content, 200)}
                </p>
                <div className="flex items-center gap-2 text-foreground font-bold group-hover:gap-4 transition-all">
                  {t("featured.read_story")}
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ===== CATEGORY TABS ===== */}
      <section className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto pb-4 border-b border-black/5 no-scrollbar">
          {tabs.map((tab, i) => {
            const value = i === 0 ? ALL : categories[i - 1];
            const isActive = activeCategory === value;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategory(value)}
                className={`whitespace-nowrap text-lg font-bold pb-4 border-b-2 transition-colors ${
                  isActive
                    ? "text-foreground border-primary"
                    : "text-[#94A3B8] border-transparent hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== ARTICLES GRID ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {articleList.length === 0 && !featured ? (
            <p className="text-center text-[#94A3B8] py-16">
              {t("no_posts") || "No posts found."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {articleList.map((article, index) => (
                <Link
                  href={getBlogUrl(article.slug)}
                  key={article.id ?? index}
                  className="group flex flex-col h-full"
                >
                  <div className="aspect-3/2 bg-[#FAFAFA] rounded-2xl overflow-hidden mb-6 border border-black/5 relative">
                    <Image
                      width={400}
                      height={267}
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
                    {getExcerpt(article.content)}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5">
                    <span className="text-sm font-semibold text-[#94A3B8]">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t("article.read")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-24 text-center">
            <button className="px-10 py-5 bg-[#F8FAFC] rounded-full font-bold text-foreground hover:bg-[#F1F5F9] transition-colors">
              {t("archive_btn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

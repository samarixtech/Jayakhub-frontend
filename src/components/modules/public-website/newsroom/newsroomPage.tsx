"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
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
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState(ALL);

  const getBlogUrl = (slug: string) => `/newsroom/${slug}`;

  const tabs = [t("categories.all"), ...categories];

  const isFiltered = activeCategory !== ALL;

  const filtered = isFiltered
    ? blogs.filter((b) => b.category === activeCategory)
    : blogs;

  const articleList = filtered;

  return (
    <div className="bg-white">
      {/* ===== HERO HEADLINE ===== */}
      <PublicHeroSection
        badge={t("hero.badge")}
        title_p1={t("hero.title_p1")}
        title_highlight={t("hero.title_highlight")}
      />

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
          {articleList.length === 0 ? (
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
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors relative after:absolute after:bottom-0 after:start-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                      {t("article.read")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getBlogBySlugAction } from "@/app/actions/public/blog";
import BlogShareButtons from "@/components/modules/public-website/blogs/BlogShareButtons";

function estimateReadTime(html: string): string {
  const wordCount = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(wordCount / 200))} min read`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("Newsroom");

  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="pt-18 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          href="/blogs"
          className="inline-flex items-center text-[#94A3B8] hover:text-primary mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("post.back_to_blog")}
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold mb-6">
          <span className="text-primary bg-primary/5 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center text-[#94A3B8]">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center text-[#94A3B8]">
            <Clock className="w-4 h-4 mr-1" />
            {estimateReadTime(post.content)}
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
          {post.title}
        </h1>
      </section>

      {/* ===== FEATURED IMAGE ===== */}
      <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm relative">
          <Image
            width={1200}
            height={600}
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <BlogShareButtons
            shareLabel={t("post.share_article")}
            copyLabel={t("post.copy_link")}
            title={post.title}
          />

          <div
            className="prose prose-lg prose-slate max-w-none text-[#334155] leading-loose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#E2E8F0]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[#F1F5F9] rounded-lg text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import Blog from "@/components/modules/public-website/newsroom/newsroomPage";
import { getBlogsAction } from "@/app/actions/public/blog";

export default async function BlogsPage() {
  const result = await getBlogsAction({ limit: 100 });
  const blogs = result.success ? result.data?.items ?? [] : [];

  const categories = Array.from(new Set(blogs.map((b) => b.category))).filter(
    Boolean,
  );

  return (
    <div>
      <Blog blogs={blogs} categories={categories} />
    </div>
  );
}

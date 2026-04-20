import { getTranslations } from "next-intl/server";
import { BlogPostForm } from "../_components/blog-post-form";

export default async function NewBlogPostPage() {
  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("addPost") || "Create New Blog Post"}
        </h1>
        <p className="text-muted-foreground">
          {t("addPostDescription") || "Write a new article for your blog"}
        </p>
      </div>
      <div className="max-w-4xl">
        <BlogPostForm />
      </div>
    </div>
  );
}

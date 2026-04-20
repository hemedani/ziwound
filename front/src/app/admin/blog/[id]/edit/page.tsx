import { getTranslations } from "next-intl/server";
import { get as getBlogPost } from "@/app/actions/blogPost/get";
import { BlogPostForm } from "../../_components/blog-post-form";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("admin");
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const response = await getBlogPost(
    { _id: id },
    {
      _id: 1,
      title: 1,
      slug: 1,
      content: 1,
      isPublished: 1,
      isFeatured: 1,
      coverImage: {
        _id: 1,
        name: 1,
      },
      tags: {
        _id: 1,
        name: 1,
      },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  // Type the response.body based on our form requirements
  const postData = response.body as {
    _id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    isFeatured: boolean;
    coverImage?: { _id: string; name?: string };
    tags?: Array<{ _id: string; name: string }>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("editPost") || "Edit Blog Post"}
        </h1>
        <p className="text-muted-foreground">
          {t("editPostDescription") || "Update your blog article details"}
        </p>
      </div>
      <div className="max-w-4xl">
        <BlogPostForm initialData={postData} />
      </div>
    </div>
  );
}

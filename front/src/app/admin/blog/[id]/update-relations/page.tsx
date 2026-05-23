import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/blogPost/get";
import { BlogPostRelationsForm } from "../../_components/blog-post-relations-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UpdateRelationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateRelationsPage({ params }: UpdateRelationsPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const response = await get(
    { _id: id },
    {
      _id: 1,
      title: 1,
      slug: 1,
      coverImage: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
      tags: { _id: 1, name: 1, color: 1 },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const post = response.body as {
    _id: string;
    title: string;
    slug?: string;
    coverImage?: { _id: string; name: string; mimeType?: string; type?: string; alt_text?: string };
    tags?: { _id: string; name: string; color?: string }[];
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-body hover:text-offwhite transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToBlog") || "Back to Blog"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">
          {t("updateRelations") || "Update Relations"}
        </h1>
        <p className="text-slate-body mt-1">
          {post.title}
        </p>
      </div>
      <div className="max-w-2xl">
        <BlogPostRelationsForm post={post} />
      </div>
    </div>
  );
}

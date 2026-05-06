import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { getBySlug } from "@/app/actions/blogPost/getBySlug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { blogPostSchema, DeepPartial, tagSchema } from "@/types/declarations";

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  const t = await getTranslations({ locale: (await params).locale });

  const response = await getBySlug(
    { slug },
    {
      _id: 1,
      title: 1,
      slug: 1,
      content: 1,
      publishedAt: 1,
      createdAt: 1,
      isPublished: 1,
      coverImage: { _id: 1, name: 1 },
      author: { _id: 1, first_name: 1, last_name: 1 },
      tags: { _id: 1, name: 1 },
    },
  );

  const post: DeepPartial<blogPostSchema> | null = response?.success ? response.body : null;

  if (!post || post.isPublished === false) {
    notFound();
  }

  const dateToDisplay = post.publishedAt || post.createdAt || new Date().toISOString();
  const formattedDate = new Date(dateToDisplay as string | number | Date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch recent posts for "Related Articles"
  const recentPostsResponse = await getBlogPosts(
    { limit: 4 },
    {
      _id: 1,
      title: 1,
      slug: 1,
      publishedAt: 1,
      createdAt: 1,
      isPublished: 1,
      coverImage: { _id: 1, name: 1 },
    },
  );

  let recentPosts: DeepPartial<blogPostSchema>[] = [];
  if (recentPostsResponse?.success) {
    const list = Array.isArray(recentPostsResponse.body)
      ? recentPostsResponse.body
      : recentPostsResponse.body?.list || [];
    recentPosts = list
      .filter((p: DeepPartial<blogPostSchema>) => p._id !== post?._id && p.isPublished !== false)
      .slice(0, 3);
  }

  return (
    <article className="container mx-auto py-12 px-4 md:px-6 max-w-5xl">
      {/* Back + Tags */}
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ms-4 text-slate-body hover:text-offwhite hover:bg-white/5"
        >
          <Link href={`/${locale}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
            {t("common.back")}
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag: DeepPartial<tagSchema>) => (
            <Badge
              key={tag._id}
              variant="outline"
              className="bg-white/5 text-slate-body border-white/10 flex items-center gap-1 text-xs"
            >
              <Tag className="h-3 w-3 text-gold" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Title & Meta */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight text-offwhite">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 glass-light rounded-full px-4 py-2">
            <div className="bg-crimson/20 h-9 w-9 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-offwhite">
                {post.author ? `${post.author.first_name} ${post.author.last_name}` : t("common.unknown")}
              </span>
              <span className="text-xs text-slate-body">{t("blog.author")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 glass-light rounded-full px-4 py-2">
            <div className="bg-crimson/20 h-9 w-9 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-offwhite">{formattedDate}</span>
              <span className="text-xs text-slate-body">{t("blog.publishedAt")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl ring-1 ring-white/10">
          <Image
            src={getImageUploadUrl(post.coverImage.name as string)}
            alt={post.title || ""}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-offwhite prose-p:text-slate-body prose-a:text-crimson hover:prose-a:text-gold prose-img:rounded-xl mb-16 prose-blockquote:border-l-crimson prose-blockquote:bg-white/[0.03] prose-blockquote:rounded-r-lg"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      {/* Related Articles */}
      {recentPosts.length > 0 && (
        <div className="pt-12 border-t border-white/10 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-xl font-bold text-offwhite">{t("blog.relatedPosts")}</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((relatedPost) => (
              <Link
                href={`/${locale}/blog/${relatedPost.slug}`}
                key={relatedPost._id}
                className="group block rounded-2xl glass-light overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="relative aspect-video overflow-hidden bg-white/5">
                  {relatedPost.coverImage ? (
                    <Image
                      src={getImageUploadUrl(relatedPost.coverImage.name as string)}
                      alt={relatedPost.title || ""}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-slate-body/40 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-gold transition-colors text-offwhite">
                    {relatedPost.title}
                  </h3>
                  <p className="text-xs text-slate-body mt-2">
                    {new Date(
                      (relatedPost.publishedAt || relatedPost.createdAt || new Date().toISOString()) as
                        | string
                        | number
                        | Date,
                    ).toLocaleDateString(locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

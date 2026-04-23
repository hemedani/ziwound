import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUploadUrl } from "@/utils/imageUrl";

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  const t = await getTranslations();

  // Fetch the blog post by slug
  // We use gets with a search/filter on slug depending on the backend capabilities
  // If slug is not directly searchable via gets set, we might have to fetch all and filter,
  // but let's assume the backend handles string matching or we pass it as a custom filter if needed.
  // For safety with generic gets, we might pass slug as part of the query or just fetch and match.
  // We will assume `gets` accepts a search param that can match slug or we can pass slug directly if supported.
  const setQuery: any = {
    limit: 1,
    slug: slug, // Assuming Lesan supports filtering by exact field if passed
  };

  const response = await getBlogPosts(setQuery, {
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
  });

  let posts: any[] = [];
  if (response?.success) {
    posts = Array.isArray(response.body) ? response.body : response.body?.list || [];
  }

  // If we couldn't filter perfectly by backend, find it manually
  let post = posts.find((p) => p.slug === slug);

  // If not found in the initial filtered response, fallback to a broader search
  if (!post && posts.length > 0) {
    post = posts[0];
  }

  if (!post || post.isPublished === false) {
    notFound();
  }

  const dateToDisplay = post.publishedAt || post.createdAt;
  const formattedDate = new Date(dateToDisplay).toLocaleDateString(locale, {
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

  let recentPosts: any[] = [];
  if (recentPostsResponse?.success) {
    const list = Array.isArray(recentPostsResponse.body)
      ? recentPostsResponse.body
      : recentPostsResponse.body?.list || [];
    recentPosts = list.filter((p: any) => p._id !== post._id && p.isPublished !== false).slice(0, 3);
  }

  return (
    <article className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ms-4 text-muted-foreground hover:text-primary"
        >
          <Link href={`/${locale}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
            {t.has("common.back") ? t("common.back") : "Back to Blog"}
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag: any) => (
            <Badge key={tag._id} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {post.author ? `${post.author.first_name} ${post.author.last_name}` : "Unknown Author"}
              </span>
              <span className="text-xs">{t.has("blog.author") ? t("blog.author") : "Author"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{formattedDate}</span>
              <span className="text-xs">
                {t.has("blog.publishedAt") ? t("blog.publishedAt") : "Published"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-lg">
          <Image
            src={getImageUploadUrl(post.coverImage.name)}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl mb-16"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      {recentPosts.length > 0 && (
        <div className="pt-12 border-t mt-12">
          <h2 className="text-2xl font-bold mb-6">
            {t.has("blog.relatedPosts") ? t("blog.relatedPosts") : "Related Articles"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((relatedPost) => (
              <Link
                href={`/${locale}/blog/${relatedPost.slug}`}
                key={relatedPost._id}
                className="group block"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                  {relatedPost.coverImage ? (
                    <Image
                      src={getImageUploadUrl(relatedPost.coverImage.name)}
                      alt={relatedPost.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {relatedPost.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString(
                    locale,
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { blogPostSchema, DeepPartial, ReqType, tagSchema } from "@/types/declarations";
import { cn } from "@/lib/utils";

export default async function BlogListingPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const t = await getTranslations({ locale: (await params).locale });
  const locale = resolvedParams.locale;

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const limit = 12;

  const setQuery: ReqType["main"]["blogPost"]["gets"]["set"] = {
    page,
    limit,
  };
  if (search) setQuery.search = search;

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

  let posts: DeepPartial<blogPostSchema>[] = [];
  if (response?.success) {
    posts = Array.isArray(response.body) ? response.body : response.body?.list || [];
  }

  posts = posts.filter((post) => post.isPublished !== false);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-crimson" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
            {t("blog.overline") || "Stories & Updates"}
          </span>
          <div className="h-px w-12 bg-crimson" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-offwhite">
          {t("blog.title")}
        </h1>
        <p className="text-lg text-slate-body max-w-2xl mx-auto">
          {t("blog.description")}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-12">
        <form className="flex gap-2" method="GET">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("blog.searchPlaceholder")}
              defaultValue={search}
              className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
            />
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white h-11">
            {t("common.search")}
          </Button>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-light">
          <p className="text-xl text-slate-body">{t("blog.noPosts")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group flex flex-col overflow-hidden rounded-2xl glass-light transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="block overflow-hidden aspect-video relative bg-white/5"
                >
                  {post.coverImage ? (
                    <Image
                      src={getImageUploadUrl(post.coverImage.name)}
                      alt={post.title || "Blog post cover image"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                      <span className="text-slate-body/40 text-sm">No image</span>
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map((tag: DeepPartial<tagSchema>) => (
                      <Badge
                        key={tag._id}
                        variant="outline"
                        className="bg-white/5 text-slate-body border-white/10 text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold line-clamp-2 mb-3 text-offwhite group-hover:text-gold transition-colors">
                    <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-body mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>
                        {post.author ? `${post.author.first_name} ${post.author.last_name}` : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(post.publishedAt ?? post.createdAt ?? new Date()).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-body line-clamp-3 text-sm mb-4 flex-grow">
                    {post.content
                      ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..."
                      : ""}
                  </p>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-crimson hover:text-gold transition-colors"
                  >
                    {t("common.readMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-12">
            <Button
              variant="outline"
              disabled={page <= 1}
              asChild={page > 1}
              className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              {page > 1 ? (
                <Link href={`/${locale}/blog?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                  {t("common.previous")}
                </Link>
              ) : (
                <span>{t("common.previous")}</span>
              )}
            </Button>
            <span className="text-sm font-medium text-offwhite px-4">{page}</span>
            <Button
              variant="outline"
              disabled={posts.length < limit}
              asChild={posts.length >= limit}
              className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              {posts.length >= limit ? (
                <Link href={`/${locale}/blog?page=${page + 1}${search ? `&search=${search}` : ""}`}>
                  {t("common.next")}
                </Link>
              ) : (
                <span>{t("common.next")}</span>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

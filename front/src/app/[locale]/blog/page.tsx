import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { blogPostSchema, DeepPartial, ReqType, tagSchema } from "@/types/declarations";

export default async function BlogListingPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  // Try to use a specific namespace, fallback to common ones if not fully populated
  const t = await getTranslations({ locale: (await params).locale });
  const locale = resolvedParams.locale;

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const limit = 12;

  // We set basic queries. Depending on Lesan's implementation we might filter `isPublished: true` here or manually after
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

  // Ensure we only show published posts on the public listing
  posts = posts.filter((post) => post.isPublished !== false);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {t.has("blog.title") ? t("blog.title") : "Blog"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.has("blog.description") ? t("blog.description") : "Read our latest news and articles"}
          </p>
        </div>

        <form className="w-full md:w-auto flex gap-2" method="GET">
          <div className="relative w-full md:w-80">
            <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={
                t.has("blog.searchPlaceholder") ? t("blog.searchPlaceholder") : "Search articles..."
              }
              defaultValue={search}
              className="ps-9 w-full"
            />
          </div>
          <Button type="submit" variant="secondary">
            {t.has("common.search") ? t("common.search") : "Search"}
          </Button>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-xl text-muted-foreground">
            {t.has("blog.noPosts") ? t("blog.noPosts") : "No blog posts found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="flex flex-col overflow-hidden transition-all hover:shadow-md"
            >
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="block overflow-hidden aspect-video relative bg-muted"
              >
                {post.coverImage ? (
                  <Image
                    src={getImageUploadUrl(post.coverImage.name)}
                    alt={post.title || "Blog post cover image"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </Link>

              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map((tag: DeepPartial<tagSchema>) => (
                    <Badge key={tag._id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>
                      {post.author ? `${post.author.first_name} ${post.author.last_name}` : "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(post.publishedAt ?? post.createdAt ?? new Date()).toLocaleDateString(
                        locale,
                      )}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {/* Extract raw text from HTML content */}
                  {post.content
                    ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..."
                    : ""}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  asChild
                  variant="ghost"
                  className="p-0 h-auto font-semibold hover:bg-transparent hover:text-primary"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="flex items-center gap-1">
                    {t.has("common.readMore") ? t("common.readMore") : "Read More"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-2 mt-12">
        <Button variant="outline" disabled={page <= 1} asChild={page > 1}>
          {page > 1 ? (
            <Link href={`/${locale}/blog?page=${page - 1}${search ? `&search=${search}` : ""}`}>
              {t.has("common.previous") ? t("common.previous") : "Previous"}
            </Link>
          ) : (
            <span>{t.has("common.previous") ? t("common.previous") : "Previous"}</span>
          )}
        </Button>
        <span className="text-sm font-medium">{page}</span>
        <Button variant="outline" disabled={posts.length < limit} asChild={posts.length >= limit}>
          {posts.length >= limit ? (
            <Link href={`/${locale}/blog?page=${page + 1}${search ? `&search=${search}` : ""}`}>
              {t.has("common.next") ? t("common.next") : "Next"}
            </Link>
          ) : (
            <span>{t.has("common.next") ? t("common.next") : "Next"}</span>
          )}
        </Button>
      </div>
    </div>
  );
}

import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import type { ReqType } from "@/types/declarations";
import { AdminBlogClient } from "./admin-blog-client";
import type { BlogPostItem } from "./_components/blog-post-card";

export const metadata = {
  title: "Blog Management — ZiWound Admin",
  description: "Create, edit, and manage blog articles",
};

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  selected_language?: string;
  isFeatured?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

function extractList(
  res: { success: boolean; body: unknown } | null | undefined,
): unknown[] {
  if (res?.success) {
    if (Array.isArray(res.body)) return res.body;
    if (res.body && typeof res.body === "object" && "list" in (res.body as Record<string, unknown>)) {
      const list = (res.body as Record<string, unknown>).list;
      return Array.isArray(list) ? list : [];
    }
  }
  return [];
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const selected_language = resolvedSearchParams.selected_language || "all";
  const isFeatured = resolvedSearchParams.isFeatured || "all";
  const createdAtFrom = resolvedSearchParams.createdAtFrom || "";
  const createdAtTo = resolvedSearchParams.createdAtTo || "";
  const sortBy = (resolvedSearchParams.sortBy || "createdAt") as ReqType["main"]["blogPost"]["gets"]["set"]["sortBy"];
  const sortOrder = (resolvedSearchParams.sortOrder || "desc") as ReqType["main"]["blogPost"]["gets"]["set"]["sortOrder"];

  const setQuery: ReqType["main"]["blogPost"]["gets"]["set"] = {
    page,
    limit: 12,
  };
  if (search) setQuery.search = search;
  if (status === "published") setQuery.isPublished = true;
  if (status === "draft") setQuery.isPublished = false;
  if (selected_language !== "all")
    setQuery.selected_language = selected_language as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"];
  if (isFeatured === "true") setQuery.isFeatured = true;
  if (isFeatured === "false") setQuery.isFeatured = false;
  setQuery.sortBy = sortBy;
  setQuery.sortOrder = sortOrder;

  const projection = {
    _id: 1,
    title: 1,
    slug: 1,
    content: 1,
    isPublished: 1,
    isFeatured: 1,
    publishedAt: 1,
    createdAt: 1,
    selected_language: 1,
    author: { _id: 1, first_name: 1, last_name: 1 },
    tags: { _id: 1, name: 1, color: 1 },
    coverImage: { _id: 1, name: 1, alt_text: 1 },
  } as const;

  // Fetch main list with all current params
  const postsResponse = await getBlogPosts(setQuery, projection);
  const posts = extractList(postsResponse) as BlogPostItem[];

  // Fetch count stats using separate queries
  const publishedQuery: ReqType["main"]["blogPost"]["gets"]["set"] = { page: 1, limit: 1, isPublished: true };
  if (search) publishedQuery.search = search;
  if (selected_language !== "all")
    publishedQuery.selected_language = selected_language as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"];

  const draftQuery: ReqType["main"]["blogPost"]["gets"]["set"] = { page: 1, limit: 1, isPublished: false };
  if (search) draftQuery.search = search;
  if (selected_language !== "all")
    draftQuery.selected_language = selected_language as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"];

  const featuredQuery: ReqType["main"]["blogPost"]["gets"]["set"] = { page: 1, limit: 1, isFeatured: true };
  if (search) featuredQuery.search = search;
  if (selected_language !== "all")
    featuredQuery.selected_language = selected_language as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"];

  const [publishedResponse, draftResponse, featuredResponse] = await Promise.all([
    getBlogPosts(publishedQuery, { _id: 1 }),
    getBlogPosts(draftQuery, { _id: 1 }),
    getBlogPosts(featuredQuery, { _id: 1 }),
  ]);

  const publishedCount = extractList(publishedResponse).length;
  const draftCount = extractList(draftResponse).length;
  const featuredCount = extractList(featuredResponse).length;
  const totalCount =
    publishedCount + draftCount;

  const error =
    !postsResponse?.success
      ? postsResponse?.body?.message || "Failed to fetch blog posts"
      : null;

  const currentParams = {
    page,
    search,
    status,
    selected_language,
    isFeatured,
    createdAtFrom,
    createdAtTo,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
  };

  return (
    <AdminBlogClient
      posts={posts}
      totalCount={totalCount}
      publishedCount={publishedCount}
      draftCount={draftCount}
      featuredCount={featuredCount}
      error={error}
      currentParams={currentParams}
    />
  );
}

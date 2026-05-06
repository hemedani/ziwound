import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Edit, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReqType } from "@/types/declarations";
import { DeleteBlogPostMenuItem } from "./_components/delete-blog-post-button";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const tCommon = await getTranslations("common");

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";

  const setQuery: ReqType["main"]["blogPost"]["gets"]["set"] = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (status === "published") setQuery.isPublished = true;
  if (status === "draft") setQuery.isPublished = false;

  const response = await getBlogPosts(setQuery, {
    _id: 1,
    title: 1,
    slug: 1,
    isPublished: 1,
    publishedAt: 1,
    createdAt: 1,
    author: { _id: 1, first_name: 1, last_name: 1 },
    tags: { _id: 1, name: 1 },
  });

  type BlogPost = {
    _id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt?: string;
    author?: { _id: string; first_name?: string; last_name?: string };
    tags?: { _id: string; name: string }[];
  };

  let posts: BlogPost[] = [];
  let totalPages = 1;
  let error: string | null = null;

  if (response?.success) {
    const responseData = response.body as { list: BlogPost[]; totalPages?: number } | BlogPost[];
    posts = Array.isArray(responseData) ? responseData : responseData?.list || [];
    totalPages =
      !Array.isArray(responseData) && responseData?.totalPages ? responseData.totalPages : 1;
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch blog posts";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel") || "Admin Panel"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("blogManagement") || "Blog Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("blogManagementDescription") || "Create, edit, and manage your blog articles"}
          </p>
        </div>
        <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPost") || "New Post"}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center rounded-2xl glass-light p-5 border border-white/[0.06]">
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 start-0 m-auto ms-3 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search posts..."}
              defaultValue={search}
              className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("status") || "Status"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
                <SelectItem value="published">{t("published") || "Published"}</SelectItem>
                <SelectItem value="draft">{t("draft") || "Draft"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("applyFilters") || "Filter"}
          </Button>
        </form>
      </div>

      {error ? (
        <div className="text-center py-8 rounded-md border border-white/[0.06]">
          <p className="text-crimson-light">{error}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-body">{t("title") || "Title"}</TableHead>
                <TableHead className="text-slate-body">{t("status") || "Status"}</TableHead>
                <TableHead className="text-slate-body">{t("author") || "Author"}</TableHead>
                <TableHead className="text-slate-body">{t("tags") || "Tags"}</TableHead>
                <TableHead className="text-slate-body">{t("date") || "Date"}</TableHead>
                <TableHead className="text-right text-slate-body">{t("actions") || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell colSpan={6} className="text-center py-8 text-slate-body">
                    {t("noPosts") || "No blog posts found"}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-offwhite">{post.title}</span>
                        <span className="text-xs text-slate-body">/{post.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.isPublished ? (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {t("published") || "Published"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {t("draft") || "Draft"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-offwhite">
                      {post.author?.first_name || post.author?.last_name
                        ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim()
                        : "Admin"}
                    </TableCell>
                    <TableCell>
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag._id} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                              {tag.name}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-body">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-body">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toISOString().split("T")[0]
                        : post.createdAt
                          ? new Date(post.createdAt).toISOString().split("T")[0]
                          : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-slate-body hover:text-offwhite hover:bg-white/5 h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong border-white/10">
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              {t("viewDetails") || "View"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                            <Link href={`/admin/blog/${post._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              {tCommon("edit") || "Edit"}
                            </Link>
                          </DropdownMenuItem>
                          <DeleteBlogPostMenuItem id={post._id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!error && posts.length > 0 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none border-white/10 bg-white/5 text-offwhite opacity-30" : "border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"}
          >
            <Link
              href={`/admin/blog?page=${page - 1}${search ? `&search=${search}` : ""}${
                status !== "all" ? `&status=${status}` : ""
              }`}
            >
              {tCommon("previous") || "Previous"}
            </Link>
          </Button>
          <span className="text-sm text-slate-body px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none border-white/10 bg-white/5 text-offwhite opacity-30" : "border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"}
          >
            <Link
              href={`/admin/blog?page=${page + 1}${search ? `&search=${search}` : ""}${
                status !== "all" ? `&status=${status}` : ""
              }`}
            >
              {tCommon("next") || "Next"}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

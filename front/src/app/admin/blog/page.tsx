import { getTranslations } from "next-intl/server";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
          <h1 className="text-3xl font-bold tracking-tight">
            {t("blogManagement") || "Blog Management"}
          </h1>
          <p className="text-muted-foreground">
            {t("blogManagementDescription") || "Create, edit, and manage your blog articles"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPost") || "New Post"}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 start-0 m-auto ms-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search posts..."}
              defaultValue={search}
              className="ps-9"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder={t("status") || "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
                <SelectItem value="published">{t("published") || "Published"}</SelectItem>
                <SelectItem value="draft">{t("draft") || "Draft"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="secondary">
            {t("applyFilters") || "Filter"}
          </Button>
        </form>
      </div>

      {error ? (
        <div className="text-center py-8 bg-destructive/10 rounded-md border border-destructive/20">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title") || "Title"}</TableHead>
                <TableHead>{t("status") || "Status"}</TableHead>
                <TableHead>{t("author") || "Author"}</TableHead>
                <TableHead>{t("tags") || "Tags"}</TableHead>
                <TableHead>{t("date") || "Date"}</TableHead>
                <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("noPosts") || "No blog posts found"}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{post.title}</span>
                        <span className="text-xs text-muted-foreground">/{post.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.isPublished ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          {t("published") || "Published"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{t("draft") || "Draft"}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.author?.first_name || post.author?.last_name
                        ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim()
                        : "Admin"}
                    </TableCell>
                    <TableCell>
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag._id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              {t("viewDetails") || "View"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <Link
              href={`/admin/blog?page=${page - 1}${search ? `&search=${search}` : ""}${
                status !== "all" ? `&status=${status}` : ""
              }`}
            >
              {tCommon("previous") || "Previous"}
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
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

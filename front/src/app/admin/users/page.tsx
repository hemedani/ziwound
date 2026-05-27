import { getTranslations } from "next-intl/server";
import { getUsers } from "@/app/actions/user/getUsers";
import { countUsers } from "@/app/actions/user/countUsers";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { AdminUsersClient } from "./_components/admin-users-client";
import { ReqType, userSchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  level?: string;
  isVerified?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const level = resolvedSearchParams.level || "all";
  const isVerified = resolvedSearchParams.isVerified || "all";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["user"]["getUsers"]["set"] & { search?: string } = {
    page,
    limit: 20,
  };
  if (search) setQuery.search = search;
  if (level !== "all") {
    setQuery.levels = [level] as ReqType["main"]["user"]["getUsers"]["set"]["levels"];
  }
  if (isVerified !== "all") {
    setQuery.isVerified = isVerified as "true" | "false";
  }
  setQuery.sortBy = sortBy as ReqType["main"]["user"]["getUsers"]["set"]["sortBy"];
  setQuery.sortOrder = sortOrder as ReqType["main"]["user"]["getUsers"]["set"]["sortOrder"];

  const response = await getUsers(setQuery, {
    _id: 1,
    first_name: 1,
    last_name: 1,
    email: 1,
    level: 1,
    is_verified: 1,
    verified: 1,
    createdAt: 1,
    avatar: { _id: 1, name: 1 },
  });

  const totalRes = await countUsers({}, { qty: 1 as const });

  let users: userSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    users = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch users";
  }

  const totalCount =
    totalRes?.success && totalRes.body && typeof totalRes.body === "object"
      ? ((totalRes.body as Record<string, unknown>)?.qty as number) ?? 0
      : 0;

  const queryString = `${search ? `&search=${search}` : ""}${level !== "all" ? `&level=${level}` : ""}${isVerified !== "all" ? `&isVerified=${isVerified}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const prevPageUrl = page > 1 ? `/admin/users?page=${page - 1}${queryString}` : "";
  const nextPageUrl = users.length >= 20 ? `/admin/users?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchUsers") || "Search users..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select name="level" defaultValue={level}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
              <SelectValue placeholder={t("level")} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">{t("allLevels") || "All Levels"}</SelectItem>
              <SelectItem value="Manager">{t("level_Manager") || "Manager"}</SelectItem>
              <SelectItem value="Editor">{t("level_Editor") || "Editor"}</SelectItem>
              <SelectItem value="Reporter">{t("Reporter") || "Reporter"}</SelectItem>
              <SelectItem value="Artist">{t("Artist") || "Artist"}</SelectItem>
              <SelectItem value="Diplomat">{t("Diplomat") || "Diplomat"}</SelectItem>
              <SelectItem value="Researcher">{t("Researcher") || "Researcher"}</SelectItem>
              <SelectItem value="Ordinary">{t("level_Ordinary") || "Ordinary"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select name="isVerified" defaultValue={isVerified}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
              <SelectValue placeholder={t("verificationStatus") || "Verification"} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">{t("all") || "All"}</SelectItem>
              <SelectItem value="true">{t("verified") || "Verified"}</SelectItem>
              <SelectItem value="false">{t("unverified") || "Unverified"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select name="sortBy" defaultValue={sortBy}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
              <SelectValue placeholder={t("sortBy") || "Sort By"} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="createdAt">{t("date") || "Date"}</SelectItem>
              <SelectItem value="first_name">{t("name") || "Name"}</SelectItem>
              <SelectItem value="level">{t("level") || "Level"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select name="sortOrder" defaultValue={sortOrder}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
              <SelectValue placeholder={t("sortOrder") || "Order"} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="desc">{t("descending") || "Descending"}</SelectItem>
              <SelectItem value="asc">{t("ascending") || "Ascending"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
        {search || level !== "all" || isVerified !== "all" ? (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href="/admin/users">
              {t("clear") || "Clear"}
            </Link>
          </Button>
        ) : null}
      </form>

      <AdminUsersClient
        users={users}
        totalCount={totalCount}
        error={error}
        search={search}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}

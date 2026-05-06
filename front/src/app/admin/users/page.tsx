import { getTranslations } from "next-intl/server";
import { getUsers } from "@/app/actions/user/getUsers";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { UsersTable } from "./users-table";
import { AddUserModal } from "./add-user-modal";
import { ReqType, userSchema } from "@/types/declarations";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    level?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const level = resolvedSearchParams.level || "all";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["user"]["getUsers"]["set"] & {
    search?: string;
  } = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (level !== "all")
    setQuery.levels = [level] as ReqType["main"]["user"]["getUsers"]["set"]["levels"];
  setQuery.sortBy = sortBy as ReqType["main"]["user"]["getUsers"]["set"]["sortBy"];
  setQuery.sortOrder = sortOrder as ReqType["main"]["user"]["getUsers"]["set"]["sortOrder"];

  // Fetch users
  const response = await getUsers(setQuery, {
    _id: 1,
    first_name: 1,
    last_name: 1,
    email: 1,
    level: 1,
    createdAt: 1,
  });

  let users: userSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    users = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch users";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("usersManagement") || "Users Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("usersManagementDescription") || "Manage user accounts and roles"}
          </p>
        </div>
        <AddUserModal />
      </div>

      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
        <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("searchUsers") || "Search users..."}
              defaultValue={search}
              className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="level" defaultValue={level}>
              <SelectTrigger>
                <SelectValue placeholder={t("level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allLevels") || "All Levels"}</SelectItem>
                <SelectItem value="Ghost">{t("level_Ghost") || "Ghost"}</SelectItem>
                <SelectItem value="Manager">{t("level_Manager") || "Manager"}</SelectItem>
                <SelectItem value="Editor">{t("level_Editor") || "Editor"}</SelectItem>
                <SelectItem value="Ordinary">{t("level_Ordinary") || "Ordinary"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortBy") || "Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t("date") || "Date"}</SelectItem>
                <SelectItem value="first_name">{t("name") || "Name"}</SelectItem>
                <SelectItem value="level">{t("level") || "Level"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortOrder") || "Order"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("descending") || "Descending"}</SelectItem>
                <SelectItem value="asc">{t("ascending") || "Ascending"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      <UsersTable users={users} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/users?page=${page - 1}${search ? `&search=${search}` : ""}${level !== "all" ? `&level=${level}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {users.length >= 10 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/users?page=${page + 1}${search ? `&search=${search}` : ""}${level !== "all" ? `&level=${level}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}

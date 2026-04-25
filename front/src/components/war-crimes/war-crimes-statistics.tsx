"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import type { DeepPartial, reportSchema, categorySchema } from "@/types/declarations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface WarCrimesStatisticsProps {
  reports: DeepPartial<reportSchema>[];
  categories: DeepPartial<categorySchema>[];
  totalCount: number;
  locale: string;
}

export function WarCrimesStatistics({
  reports,
  categories,
  totalCount,
  locale,
}: WarCrimesStatisticsProps) {
  const t = useTranslations("warCrimes");

  const priorityCounts = {
    High: reports.filter((r) => r.priority === "High").length,
    Medium: reports.filter((r) => r.priority === "Medium").length,
    Low: reports.filter((r) => r.priority === "Low").length,
  };

  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    if (r.category?._id) {
      categoryCounts[r.category._id] = (categoryCounts[r.category._id] || 0) + 1;
    }
  });

  const topCategories = categories
    .map((cat) => ({
      name: cat.name || "Unknown",
      count: categoryCounts[cat._id || ""] || 0,
      color: cat.color || "#888888",
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const priorityData = {
    labels: [t("priority.high"), t("priority.medium"), t("priority.low")],
    datasets: [
      {
        label: t("byPriority"),
        data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low],
        backgroundColor: ["#ef4444", "#eab308", "#22c55e"],
      },
    ],
  };

  const categoryData = {
    labels: topCategories.map((c) => c.name),
    datasets: [
      {
        data: topCategories.map((c) => c.count),
        backgroundColor: topCategories.map((c) => c.color),
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalReports")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("priority.high")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">{priorityCounts.High}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("priority.medium")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-warning">{priorityCounts.Medium}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("priority.low")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">{priorityCounts.Low}</div>
        </CardContent>
      </Card>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("byPriority")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={priorityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("byCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {topCategories.length > 0 ? (
                <Pie
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {t("noResults")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {topCategories.length > 0 && (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>{t("byCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((cat) => (
                <Badge
                  key={cat.name}
                  style={{ backgroundColor: cat.color }}
                  className="text-white"
                >
                  {cat.name}: {cat.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
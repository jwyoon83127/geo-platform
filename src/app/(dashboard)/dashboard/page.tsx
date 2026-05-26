"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MentionsChart } from "@/components/dashboard/mentions-chart";
import {
  TrendingUp,
  MessageSquare,
  Building2,
  Eye,
} from "lucide-react";

interface Brand {
  id: string;
  name: string;
}

interface Mention {
  id: string;
  brand_id: string;
  source: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  reach: number;
  created_at: string;
  brands: { name: string } | null;
}

interface Stats {
  totalBrands: number;
  totalMentions: number;
  positiveCount: number;
  negativeCount: number;
  totalReach: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMentions, setRecentMentions] = useState<Mention[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsRes, mentionsRes] = await Promise.all([
          fetch("/api/v1/brands"),
          fetch("/api/v1/mentions?limit=5"),
        ]);
        const brandsJson = await brandsRes.json();
        const mentionsJson = await mentionsRes.json();

        const brands: Brand[] = brandsJson.data || [];
        const mentions: Mention[] = mentionsJson.data || [];

        const positiveCount = mentions.filter(
          (m) => m.sentiment === "positive"
        ).length;
        const negativeCount = mentions.filter(
          (m) => m.sentiment === "negative"
        ).length;
        const totalReach = mentions.reduce((sum, m) => sum + (m.reach || 0), 0);

        setStats({
          totalBrands: brands.length,
          totalMentions: mentionsJson.count || mentions.length,
          positiveCount,
          negativeCount,
          totalReach,
        });
        setRecentMentions(mentions.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statItems = stats
    ? [
        {
          title: "Total Brands",
          value: String(stats.totalBrands),
          icon: Building2,
          change: "등록된 브랜드",
        },
        {
          title: "Total Mentions",
          value: String(stats.totalMentions),
          icon: MessageSquare,
          change: "수집된 멘션",
        },
        {
          title: "Positive Rate",
          value:
            stats.totalMentions > 0
              ? `${Math.round(
                  (stats.positiveCount / stats.totalMentions) * 100
                )}%`
              : "0%",
          icon: TrendingUp,
          change: `${stats.positiveCount} 긍정 / ${stats.negativeCount} 부정`,
        },
        {
          title: "Total Reach",
          value: `${(stats.totalReach / 1000).toFixed(1)}K`,
          icon: Eye,
          change: "예상 도달 수",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          브랜드 멘션과 분석 데이터를 한눈에 확인하세요.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : statItems.map((stat) => (
              <Card key={stat.title} className="rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Chart */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Mentions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <MentionsChart />
        </CardContent>
      </Card>

      {/* Recent Mentions Table */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Recent Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : recentMentions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">멘션이 없습니다</p>
              <p className="text-sm text-muted-foreground">
                브랜드를 등록하고 멘션 수집을 시작하세요.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMentions.map((mention) => (
                  <TableRow key={mention.id}>
                    <TableCell className="font-medium">
                      {mention.brands?.name || "—"}
                    </TableCell>
                    <TableCell>{mention.source}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {mention.content}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          mention.sentiment === "positive"
                            ? "default"
                            : mention.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                        className="rounded-full"
                      >
                        {mention.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(mention.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

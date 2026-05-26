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
import { MentionsChart } from "@/components/dashboard/mentions-chart";
import {
  TrendingUp,
  MessageSquare,
  Building2,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Total Brands",
    value: "12",
    icon: Building2,
    change: "+2 this month",
  },
  {
    title: "Total Mentions",
    value: "1,284",
    icon: MessageSquare,
    change: "+124 this week",
  },
  {
    title: "Avg. Sentiment",
    value: "72%",
    icon: TrendingUp,
    change: "+5% vs last month",
  },
  {
    title: "Total Reach",
    value: "45.2K",
    icon: Eye,
    change: "+12% vs last month",
  },
];

const recentMentions = [
  {
    id: 1,
    brand: "Acme Corp",
    source: "Twitter",
    content: "Really loving the new features from @acme...",
    sentiment: "positive",
    date: "2 hours ago",
  },
  {
    id: 2,
    brand: "Globex",
    source: "Reddit",
    content: "Globex support has been amazing lately...",
    sentiment: "positive",
    date: "5 hours ago",
  },
  {
    id: 3,
    brand: "Initech",
    source: "News",
    content: "Initech announces new partnership...",
    sentiment: "neutral",
    date: "1 day ago",
  },
  {
    id: 4,
    brand: "Hooli",
    source: "Twitter",
    content: "Disappointed with the latest update...",
    sentiment: "negative",
    date: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your brand mentions and analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
      <Card>
        <CardHeader>
          <CardTitle>Mentions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <MentionsChart />
        </CardContent>
      </Card>

      {/* Recent Mentions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mentions</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{mention.brand}</TableCell>
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
                    >
                      {mention.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {mention.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

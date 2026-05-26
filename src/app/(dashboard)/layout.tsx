import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import {
  Home,
  BarChart3,
  Settings,
  Search,
  Bell,
  Building2,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react";

const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Brands", href: "/dashboard/brands", icon: Building2 },
  { title: "Mentions", href: "/dashboard/mentions", icon: MessageSquare },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar — 모바일: w-16(아이콘만), 데스크톱: w-64 */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r bg-background md:w-64">
        <div className="flex h-14 items-center justify-center border-b px-2 md:justify-start md:px-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <span className="text-lg font-bold md:hidden">G</span>
            <span className="hidden text-base font-bold tracking-tight md:inline">
              Geo Platform
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-2 md:px-3">
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-center gap-0 rounded-md md:justify-start md:gap-3"
                asChild
              >
                <Link href={item.href} title={item.title}>
                  <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                  <span className="hidden md:inline">{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex flex-col pl-16 md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <div className="w-full flex-1">
            <form className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md bg-background pl-8 md:w-[300px] lg:w-[400px]"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>

            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 md:flex">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <form action="/api/auth/signout" method="post">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-muted-foreground hover:text-foreground"
                    type="submit"
                  >
                    <LogOut className="mr-2 h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">로그아웃</span>
                  </Button>
                </form>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

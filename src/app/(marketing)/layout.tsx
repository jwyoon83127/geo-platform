import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center px-4 lg:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-primary">
              Geo Platform
            </span>
          </Link>
          <nav className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" className="rounded-md" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Geo Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

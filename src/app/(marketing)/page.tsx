import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Globe, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-screen-xl px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 py-24 md:py-32">
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl">
              Track Your Brand Mentions
              <br className="hidden sm:inline" />
              Across the Globe
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Geo Platform helps you monitor, analyze, and respond to brand
              mentions in real-time. Powered by AI and advanced analytics.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto w-full max-w-screen-xl px-4 pb-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl">
            <CardHeader>
              <Globe className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Global Tracking</CardTitle>
              <CardDescription>
                Monitor mentions across multiple platforms and regions worldwide.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">AI-Powered</CardTitle>
              <CardDescription>
                Leverage OpenAI and Claude for intelligent mention analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Advanced Analytics</CardTitle>
              <CardDescription>
                Deep insights with interactive charts and real-time dashboards.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Secure & Reliable</CardTitle>
              <CardDescription>
                Built on Supabase with enterprise-grade security.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}

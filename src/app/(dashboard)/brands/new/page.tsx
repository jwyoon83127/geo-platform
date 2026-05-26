"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewBrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          website: website || null,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push("/dashboard/brands");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-md">
          <Link href="/dashboard/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">새 브랜드 등록</h1>
          <p className="text-muted-foreground">
            추적할 브랜드 정보를 입력하세요.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl rounded-xl">
        <CardHeader>
          <CardTitle>브랜드 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">브랜드명 *</Label>
              <Input
                id="name"
                placeholder="예: Acme Corporation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="브랜드에 대한 간단한 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">검색 키워드</Label>
              <Input
                id="keywords"
                placeholder="acme, acmecorp, acme corp (쉼표로 구분)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                멘션 검색에 사용할 키워드를 쉼표로 구분하여 입력하세요.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                asChild
                className="rounded-lg"
              >
                <Link href="/dashboard/brands">취소</Link>
              </Button>
              <Button type="submit" disabled={loading} className="rounded-lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  "등록"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

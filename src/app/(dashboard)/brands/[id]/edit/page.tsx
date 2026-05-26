"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

interface Brand {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  keywords: string[];
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    async function fetchBrand() {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/brands");
        const json = await res.json();
        const found = json.data?.find((b: Brand) => b.id === id);
        if (found) {
          setBrand(found);
          setName(found.name);
          setDescription(found.description || "");
          setWebsite(found.website || "");
          setKeywords(found.keywords?.join(", ") || "");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/brands/${id}`, {
        method: "PUT",
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">브랜드를 찾을 수 없습니다</p>
        <Button asChild className="mt-4 rounded-lg">
          <Link href="/dashboard/brands">목록으로</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-md">
          <Link href="/dashboard/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">브랜드 수정</h1>
          <p className="text-muted-foreground">
            &quot;{brand.name}&quot; 브랜드 정보를 수정하세요.
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
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">검색 키워드</Label>
              <Input
                id="keywords"
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
              <Button type="submit" disabled={saving} className="rounded-lg">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

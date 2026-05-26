"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
}

interface Mention {
  id: string;
  brand_id: string;
  source: string;
  content: string;
  url: string | null;
  author: string | null;
  sentiment: "positive" | "negative" | "neutral";
  reach: number;
  created_at: string;
  analyzed_at: string | null;
  brands: { name: string } | null;
}

const PAGE_SIZE = 10;

export default function MentionsPage() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const [brandId, setBrandId] = useState<string>("");
  const [sentiment, setSentiment] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/brands");
      const json = await res.json();
      setBrands(json.data || []);
    } catch {
      setBrands([]);
    }
  }, []);

  const fetchMentions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(offset));
      if (brandId) params.set("brand_id", brandId);
      if (sentiment) params.set("sentiment", sentiment);
      if (source) params.set("source", source);

      const res = await fetch(`/api/v1/mentions?${params.toString()}`);
      const json = await res.json();
      setMentions(json.data || []);
      setCount(json.count || 0);
    } catch {
      setMentions([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [offset, brandId, sentiment, source]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    fetchMentions();
  }, [fetchMentions]);

  const handleReset = () => {
    setBrandId("");
    setSentiment("");
    setSource("");
    setSearch("");
    setOffset(0);
  };

  const handleBatchAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/v1/mentions/analyze", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        toast.success(`${json.success}개 멘션 AI 분석 완료`);
        fetchMentions();
      } else {
        toast.error(json.error || "분석 중 오류가 발생했습니다");
      }
    } catch {
      toast.error("분석 중 오류가 발생했습니다");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id);
    try {
      const res = await fetch(`/api/v1/mentions/${id}/analyze`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success("AI 분석 완료");
        fetchMentions();
      } else {
        const json = await res.json();
        toast.error(json.error || "분석 중 오류가 발생했습니다");
      }
    } catch {
      toast.error("분석 중 오류가 발생했습니다");
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredMentions = search
    ? mentions.filter((m) =>
        m.content.toLowerCase().includes(search.toLowerCase()) ||
        m.author?.toLowerCase().includes(search.toLowerCase())
      )
    : mentions;

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mentions</h1>
        <p className="text-muted-foreground">
          브랜드 멘션을 검색하고 필터링하세요.
        </p>
      </div>

      {/* Filters */}
      <Card className="rounded-xl">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1.5 block">브랜드</label>
              <Select value={brandId || undefined} onValueChange={(v) => setBrandId(v || "")}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="전체 브랜드" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 브랜드</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1.5 block">감성</label>
              <Select value={sentiment || undefined} onValueChange={(v) => setSentiment(v || "")}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="전체 감성" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 감성</SelectItem>
                  <SelectItem value="positive">긍정</SelectItem>
                  <SelectItem value="negative">부정</SelectItem>
                  <SelectItem value="neutral">중립</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1.5 block">소스</label>
              <Select value={source || undefined} onValueChange={(v) => setSource(v || "")}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="전체 소스" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 소스</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Reddit">Reddit</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1.5 block">검색</label>
              <Input
                placeholder="내용 또는 작성자 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-md"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleBatchAnalyze}
          disabled={analyzing}
          className="rounded-lg"
        >
          {analyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          미분석 멘션 AI 분석
        </Button>
      </div>

      {/* Mentions Table */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>
            멘션 목록{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({count}개)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMentions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">멘션이 없습니다</p>
              <p className="text-sm text-muted-foreground">
                필터를 변경하거나 새로운 멘션을 등록하세요.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>브랜드</TableHead>
                    <TableHead>소스</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead>감성</TableHead>
                    <TableHead>도달</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMentions.map((mention) => (
                    <TableRow key={mention.id}>
                      <TableCell className="font-medium">
                        {mention.brands?.name || "—"}
                      </TableCell>
                      <TableCell>{mention.source}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <a
                          href={mention.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block hover:underline"
                          title={mention.content}
                        >
                          {mention.content}
                        </a>
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
                          {mention.sentiment === "positive"
                            ? "긍정"
                            : mention.sentiment === "negative"
                              ? "부정"
                              : "중립"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {mention.reach.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(mention.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </TableCell>
                      <TableCell>
                        {!mention.analyzed_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAnalyze(mention.id)}
                            disabled={analyzingId === mention.id}
                            className="rounded-md"
                          >
                            {analyzingId === mention.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages} 페이지
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}
                    disabled={offset === 0}
                    className="rounded-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOffset((p) => p + PAGE_SIZE)}
                    disabled={offset + PAGE_SIZE >= count}
                    className="rounded-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

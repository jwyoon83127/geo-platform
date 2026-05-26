"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  keywords: string[];
  created_at: string;
}

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    brand: Brand | null;
  }>({ open: false, brand: null });
  const [deleting, setDeleting] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/brands");
      const json = await res.json();
      setBrands(json.data || []);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async () => {
    if (!deleteDialog.brand) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/brands/${deleteDialog.brand.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== deleteDialog.brand!.id));
      }
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, brand: null });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">
            추적할 브랜드를 관리하세요.
          </p>
        </div>
        <Button asChild className="rounded-lg">
          <Link href="/dashboard/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            새 브랜드
          </Link>
        </Button>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>브랜드 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">브랜드가 없습니다</p>
              <p className="text-sm text-muted-foreground">
                새 브랜드를 등록하여 멘션 추적을 시작하세요.
              </p>
              <Button asChild className="mt-4 rounded-lg">
                <Link href="/dashboard/brands/new">
                  <Plus className="mr-2 h-4 w-4" />
                  새 브랜드 등록
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>키워드</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/brands/${brand.id}/edit`}
                        className="hover:underline"
                      >
                        {brand.name}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {brand.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {brand.keywords?.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                          >
                            {kw}
                          </span>
                        ))}
                        {(brand.keywords?.length || 0) > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{brand.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(brand.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-md"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/brands/${brand.id}/edit`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setDeleteDialog({ open: true, brand })
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, brand: null })
        }
      >
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>브랜드 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteDialog.brand?.name}&quot; 브랜드를 정말 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, brand: null })}
              className="rounded-lg"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

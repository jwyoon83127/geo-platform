import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // 인증이 필요 없는 public 경로
  const publicPaths = ["/login", "/signup", "/auth", "/api/seed", "/api/v1/brands", "/api/v1/mentions"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 로그인하지 않은 사용자는 /login으로 리다이렉트
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 로그인한 사용자는 /login, /signup 접근 불가 → /dashboard로 리다이렉트
  if (user && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

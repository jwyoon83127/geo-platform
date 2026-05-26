# Geo Platform — Agent Rules

> 이 문서는 AI 에이전트(코딩 어시스턴트)가 이 프로젝트를 작업할 때 반드시 따라야 할 규칙입니다.

---

## 1. Project Overview

**Geo Platform**은 브랜드 멘션(언급)을 추적하고 분석하는 SaaS 플랫폼입니다.

- Next.js 16 App Router (Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui v4 (`base-nova` preset)
- Supabase (PostgreSQL + Auth + RLS)
- OpenAI / Anthropic (AI 멘션 분석)
- Stripe (결제), Resend (이메일)

---

## 2. Folder Structure Rules

```
src/
  app/
    (marketing)/          # 랜딩 페이지 그룹 (URL에 영향 없음)
    (dashboard)/          # 대시보드 그룹
      dashboard/          # 실제 경로: /dashboard
      layout.tsx          # Sidebar + Header 레이아웃
    api/v1/               # REST API Routes
      brands/
      mentions/
  components/
    ui/                   # shadcn/ui 컴포넌트만
    dashboard/            # 페이지별 컴포넌트
  lib/
    supabase/
      client.ts           # Browser Client (@supabase/ssr)
      server.ts           # Server Client (@supabase/ssr + cookies)
    ai/
      openai.ts           # OpenAI API 호출
    utils.ts              # cn() 유틸리티
  types/
    database.ts           # DB 타입 (수동 or supabase gen)
supabase/
  migrations/             # SQL 마이그레이션 파일
```

### Naming Conventions
- **Directories**: `kebab-case` — `(marketing)`, `v1/brands`
- **Components**: `PascalCase` — `Button.tsx`, `MentionsChart.tsx`
- **Hooks**: `useCamelCase` — `useAuth.ts`
- **Utils/Lib**: `camelCase` — `client.ts`, `openai.ts`
- **API Routes**: `route.ts` (Next.js App Router 표준)

---

## 3. Next.js App Router Rules

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

### Additional Rules
- **Server Components by default** — 클라이언트 컴포넌트가 필요할 때만 `"use client"` 사용
- **Route Groups** (`(folder)`)는 URL 경로에 포함되지 않음
- **Parallel pages on same path are FORBIDDEN** — `(marketing)/page.tsx`와 `(dashboard)/page.tsx`가 동시에 존재하면 빌드 실패
- **API Routes**: `app/api/v1/.../route.ts` 구조. HTTP 메서드별 `GET`, `POST`, `PUT`, `DELETE` export

---

## 4. Supabase Rules

### Client Usage
| 환경 | Import | 사용처 |
|------|--------|--------|
| Browser | `@/lib/supabase/client.ts` | `createBrowserClient` — Client Components |
| Server | `@/lib/supabase/server.ts` | `createServerClient` — Server Components / API Routes |

### Critical
- **RLS is ENABLED** on all tables (`brands`, `mentions`).
- API Routes에서 `auth.uid()`는 Supabase Auth 세션 기반입니다. Auth 미구현 시 데이터 접근 불가.
- **Never use service_role key on the client.**
- DB 타입은 `supabase gen types typescript`로 생성 후 `src/types/supabase.ts`에 저장.

### SQL Migrations
- 파일명: `supabase/migrations/NNN_description.sql`
- 모든 테이블 생성 시 RLS 정책 + 인덱스 함께 작성
- `updated_at` 자동 갱신 트리거 포함

---

## 5. shadcn/ui Rules

- **Preset**: `base-nova` (Tailwind v4 기반)
- **컴포넌트 추가**: `npx shadcn@latest add <component>`
- **Button `asChild`**: v4 기본 Button은 `asChild` 미지원. `@radix-ui/react-slot` 추가 후 커스텀 Button 사용
- 아이콘: `lucide-react`
- 유틸: `cn()` from `@/lib/utils`

---

## 6. API Route Rules

```ts
// app/api/v1/brands/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("brands").select("*");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
```

- 항상 `try/catch` 사용
- Supabase error는 `NextResponse.json({ error: ... }, { status: 500 })` 반환
- `request.json()` 사용 전 `Content-Type` 검증 불필요 (Next.js 내집)

---

## 7. AI Module Rules

- **위치**: `src/lib/ai/openai.ts`
- **API Key**: `process.env.OPENAI_API_KEY` (서버 전용)
- **모델 기본값**: `gpt-4o-mini`
- **응답 포맷**: `json_object` 사용 시 타입 안전하게 파싱
- **Anthropic**: `@anthropic-ai/sdk` 사용, `process.env.ANTHROPIC_API_KEY`

---

## 8. Sub-Agent Usage Guide

| 상황 | 에이전트 타입 | 사용법 |
|------|--------------|--------|
| 코드베이스 탐색 (3개 이상 파일 검색) | `explore` | `Agent(subagent_type="explore")` |
| 독립적 기능 구현 (UI, API 등) | `coder` | `Agent(subagent_type="coder")` |
| 아키텍처/설계 계획 | `plan` | `Agent(subagent_type="plan")` |

### Guidelines
- explore는 **read-only** — 코드 수정하지 않음
- coder는 독립적 작업 수행 후 결과 보고
- plan은 구현 전 **반드시 사용자 승인** 받음

---

## 9. Environment Variables

`.env.local`에 필요한 키:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`.env.local`은 **절대 Git에 커밋하지 않음** (`.gitignore` 포함됨)

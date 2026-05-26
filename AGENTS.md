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

### 8.1 Built-in Agent Types

| 상황 | 에이전트 타입 | 사용법 |
|------|--------------|--------|
| 코드베이스 탐색 (3개 이상 파일 검색) | `explore` | `Agent(subagent_type="explore")` |
| 독립적 기능 구현 (UI, API 등) | `coder` | `Agent(subagent_type="coder")` |
| 아키텍처/설계 계획 | `plan` | `Agent(subagent_type="plan")` |

### Guidelines
- explore는 **read-only** — 코드 수정하지 않음
- coder는 독립적 작업 수행 후 결과 보고
- plan은 구현 전 **반드시 사용자 승인** 받음

### 8.2 Project Domain Agents (프롬프트 파일)

Geo Platform 전용으로 미리 정의된 전문가 에이전트 프롬프트입니다. 작업 위임 시 해당 파일 내용을 프롬프트에 포함하세요.

| 역할 | 프로필 | 프롬프트 파일 |
|------|--------|--------------|
| **UI/UX Planner** | 30년차 UI/UX 기획자. HCI 박사. | `.agents/ui-ux-planner.md` |
| **Fullstack Dev** | 30년차 풀스택 개발자. 컴퓨터 공학 박사. | `.agents/fullstack-dev.md` |
| **QA Engineer** | 30년차 QA 엔지니어. 소프트웨어 공학 박사. | `.agents/qa-engineer.md` |

### 8.3 Checklist Rule (필수)

> **모든 서브 에이전트는 작업을 시작하기 전과 완료 후 반드시 체크리스트를 작성하고 검토해야 합니다.**

#### 시작 전 (Pre-Flight)
1. `AGENTS.md`, `DESIGN.md`, `CLAUDE.md` 확인
2. 관련 기존 코드 탐색 (`explore` 권장)
3. 작업 범위 및 영향 파일 식별
4. **체크리스트 작성** — `templates/checklist.md` 템플릿 사용

#### 완료 후 (Post-Flight)
1. `npm run build` 통과 확인
2. 디자인 시스템 준수 확인 (Pretendard, CITI Blue, rounded, 정렬)
3. 보안 검증 (API Key 노출, RLS, 입력값 검증)
4. **체크리스트 검토** — 완료 항목 체크, 미완료 시 사유 기록

### 8.4 Agent Collaboration Workflow

```
[새 기능 요청]
    ↓
[Plan Agent] — 아키텍처 설계 및 단계 분해
    ↓
[UI/UX Planner] — 화면 기획 + 체크리스트 작성
    ↓
[Fullstack Dev] — 코드 구현 + 체크리스트 작성
    ↓
[QA Engineer] — 품질 검증 + 체크리스트 검토
    ↓
[Merge & Push]
```

### 8.5 Checklist Storage

완료된 체크리스트는 아래 형식으로 저장하여 추적합니다:
```
templates/completed/YYYYMMDD_[작업명]_체크리스트.md
```

---

## 9. Decision Authority — 묻지 말고 진행

> 사용자가 "순차적으로 진행해줘" 또는 "허용해줘"라고 하면, 아래 규칙에 따라 **자율적으로 판단하고 즉시 실행**합니다. 작은 결정마다 질문하지 마세요.

### ✅ 자율 진행 (묻지 않고 바로 실행)

| 상황 | 예시 |
|------|------|
| **패키지 설치** | `npm install`, shadcn/ui 컴포넌트 추가 |
| **코드 리팩토링** | 변수명 변경, 함수 분리, 중복 제거 |
| **빌드/타입 에러 수정** | TypeScript 에러, import 오류, 빌드 실패 |
| **UI 마이너 수정** | 색상/간격/폰트 조정, rounded 변경 |
| **테스트 코드 작성** | 단위 테스트, 스토리북 추가 |
| **문서 업데이트** | README, AGENTS.md, 주석 추가 |
| **기본 파일 생성** | 페이지, 컴포넌트, API Route 신규 생성 |
| **Git 커밋/푸시** | 작업 완료 후 `git add/commit/push` |

### ⚠️ 반드시 사용자에게 알리고 진행 (또는 승인 후 진행)

| 상황 | 이유 |
|------|------|
| **DB 스키마 변경** | 데이터 손실/마이그레이션 영향 |
| **API 구조 변경** | 클라이언트 호환성 깨짐 |
| **새로운 외부 서비스 연동** | 비용, 인증, 보안 검토 필요 |
| **환경 변수 추가/변경** | `.env.local`에 새 키 필요 |
| **비용 발생 기능** | OpenAI API 대량 호출, Stripe 결제 등 |
| **보안 정책 변경** | RLS 해제, CORS 변경, 인증 우회 |
| **프로덕션 배포** | 실제 서비스에 영향 |

### 🚫 절대 하지 말 것

- `.env.local`의 실제 키 값을 Git에 커밋
- `git push --force`
- 프로덕션 DB에 직접 `DELETE/DROP`
- 사용자 명시적 동의 없이 유료 API 대량 호출

### 기본 원칙

> **"모르겠으면 묻는다"가 아니라 "당연한 것은 바로 한다"**  
> 작은 실수는 빠르게 고치면 됩니다. 속도가 우선입니다.

---

## 10. Environment Variables

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

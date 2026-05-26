# Geo Platform

브랜드 멘션(언급)을 실시간으로 추적하고 AI로 분석하는 SaaS 플랫폼입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui v4 (base-nova preset) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI GPT-4o-mini, Anthropic Claude |
| Payment | Stripe |
| Email | Resend |
| Charts | Recharts |

---

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/jwyoon83127/geo-platform.git
cd geo-platform
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 각 서비스의 API 키를 입력하세요.

| 변수 | 설명 | 얻는 곳 |
|------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase Dashboard → API Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트용 anon key | Supabase Dashboard → API Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버용 service_role key | Supabase Dashboard → API Settings (비밀!) |
| `OPENAI_API_KEY` | OpenAI API 키 | OpenAI Platform |
| `ANTHROPIC_API_KEY` | Anthropic API 키 | Anthropic Console |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | Stripe Dashboard |
| `RESEND_API_KEY` | Resend API 키 | Resend Dashboard |

### 3. Supabase 데이터베이스 설정

1. [Supabase Dashboard](https://app.supabase.com) 에서 프로젝트 선택
2. **SQL Editor** → **New query**
3. `supabase/migrations/001_initial_schema.sql` 내용을 복사해서 실행
4. **Table Editor** 에서 `brands`, `mentions` 테이블이 생성되었는지 확인

### 4. Supabase 타입 생성 (선택)

```bash
npx supabase gen types typescript \
  --project-id <your-project-ref> \
  --schema public > src/types/supabase.ts
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

---

## 폴더 구조

```
src/
  app/
    (marketing)/          # 랜딩 페이지 (/, /about 등)
      page.tsx
      layout.tsx
    (dashboard)/          # 대시보드 영역
      layout.tsx          # Sidebar + Header
      dashboard/
        page.tsx          # /dashboard
      ...
    api/v1/               # REST API
      brands/route.ts
      mentions/route.ts
  components/
    ui/                   # shadcn/ui 컴포넌트
    dashboard/            # 대시보드 전용 컴포넌트
  lib/
    supabase/             # Supabase 클라이언트
    ai/                   # OpenAI/Claude 모듈
  types/                  # TypeScript 타입 정의
supabase/
  migrations/             # DB 마이그레이션 SQL
```

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 시작 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
```

---

## 주요 기능

- **랜딩 페이지** — 서비스 소개 및 CTA
- **대시보드** — 브랜드/멘션 통계, 차트, 테이블
- **브랜드 관리** — 추적할 브랜드 등록/수정/삭제
- **멘션 추적** — 다양한 소스(Twitter, Reddit, 뉴스)에서 브랜드 언급 수집
- **AI 감성 분석** — OpenAI/Claude로 멘션의 감성(positive/negative/neutral) 분석
- **결제** — Stripe 구독 관리

---

## 문서

- [AGENTS.md](./AGENTS.md) — AI 에이전트 코딩 규칙
- [CLAUDE.md](./CLAUDE.md) — Claude 에이전트 가이드라인

---

## 라이선스

Private

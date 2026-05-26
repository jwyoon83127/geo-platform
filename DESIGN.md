# Geo Platform — Design System

> AI 에이전트와 개발자가 UI를 구축할 때 따르는 디자인 규칙서입니다.

---

## 1. Design Philosophy

- **Minimal & Professional** — 불필요한 장식 제거, 정보 전달 우선
- **Consistent Spacing** — 4px 기반의 체계적인 간격, 화면 정렬(grid snap) 유지
- **Accessible** — WCAG 2.1 AA 수준 준수 (명도 대비, 키보드 네비게이션)
- **Responsive First** — Mobile → Tablet → Desktop 순서로 구현
- **Rounded & Soft** — 모든 박스 요소는 둥근 모서리 적용, 하드한 직각 지양

---

## 2. Color System

shadcn/ui v4 CSS Variables를 사용합니다. 직접 HEX/RGB를 쓰지 마세요.

### Primary: CITI Deep Blue

브랜드 메인 컬러는 **CITI 은행 로고 스타일의 짙은 파랑**입니다.

| Mode | Token | oklch 값 | HEX 근사 |
|------|-------|----------|----------|
| Light | `--primary` | `oklch(0.38 0.13 250)` | `#003B70` |
| Light | `--primary-foreground` | `oklch(0.985 0 0)` | `#FFFFFF` |
| Dark | `--primary` | `oklch(0.60 0.13 250)` | `#4A9FD4` |
| Dark | `--primary-foreground` | `oklch(0.145 0 0)` | `#0A0A0A` |
| Light | `--ring` | `oklch(0.55 0.12 250)` | 포커스 링 |
| Dark | `--ring` | `oklch(0.60 0.13 250)` | 포커스 링 |

### Base Colors (Light Mode)

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Background | `--background` | 페이지 전체 배경 (흰색) |
| Foreground | `--foreground` | 기본 텍스트 (거의 검정) |
| Primary | `--primary` | 메인 CTA, 활성 상태, 사이드바 강조 **(짙은 파랑)** |
| Secondary | `--secondary` | 보조 버튼, 태그 |
| Muted | `--muted` | 비활성 배경, 구분선 영역 |
| Border | `--border` | 카드/입력창 테두리 |
| Destructive | `--destructive` | 삭제, 에러, 부정적 감성 |
| Card | `--card` | 카드 컴포넌트 배경 |
| Sidebar | `--sidebar` | 사이드바 배경 |

### Chart Colors (Data Visualization)

차트 색상도 CITI Blue 팔레트를 기반으로 조화롭게 구성합니다:

| Token | Variable | HEX 근사 |
|-------|----------|----------|
| Chart 1 | `--chart-1` | `#003B70` (짙은 파랑) |
| Chart 2 | `--chart-2` | `#4A9FD4` (중간 파랑) |
| Chart 3 | `--chart-3` | `#2E6FA8` (청회색) |
| Chart 4 | `--chart-4` | `#6BB3E0` (밝은 하늘) |
| Chart 5 | `--chart-5` | `#8ECAE6` (연한 하늘) |

### Dark Mode
`.dark` 클래스가 html에 붙으면 자동으로 다크모드 변수가 적용됩니다. 별도 처리 불필요.

### 사용 규칙

```css
/* ❌ 잘못된 사용 */
color: #000000;
background: oklch(0.5 0 0);

/* ✅ 올바른 사용 */
color: var(--foreground);
background: var(--background);
border-color: var(--border);
```

Tailwind 클래스:
```
bg-background text-foreground border-border
bg-primary text-primary-foreground
bg-destructive text-destructive-foreground
```

---

## 3. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Body | **Pretendard** | 400 | `text-sm` (14px) |
| Heading 1 | **Pretendard** | 700 | `text-3xl` / `md:text-6xl` |
| Heading 2 | **Pretendard** | 700 | `text-2xl` |
| Heading 3 | **Pretendard** | 600 | `text-lg` |
| Card Title | **Pretendard** | 500 | `text-sm` |
| Mono/Code | Geist Mono | 400 | `text-sm` |

### Pretendard 적용
- `globals.css`에 `@fontsource/pretendard` import
- `--font-sans: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- **한국어/영어 혼용** 시 `lang="ko"` 속성 유지
- `tracking-tight`를 제목에 사용하여 타이트한 느낌
- `text-muted-foreground`를 보조 텍스트에 사용

---

## 4. Spacing & Layout — 화면 정렬

### Container (반드시 일관되게 사용)
```
<div className="mx-auto w-full max-w-screen-xl px-4 lg:px-8">
```

- **max-width**: `max-w-screen-xl` (1280px) — 모든 메인 콘텐츠 공통
- **padding**: `px-4 lg:px-8` (16px / 32px)
- **절대 풀브레이드 사용 금지** — 콘텐츠는 항상 container 안에

### Spacing Scale (Tailwind 기본)
| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | 아이콘과 텍스트 사이 |
| `gap-2` | 8px | 버튼 그룹 낮은 밀도 |
| `gap-4` | 16px | 카드 그리드, 일반 간격 |
| `gap-6` | 24px | 섹션 간 간격 |
| `p-4` | 16px | 카드 낶 패딩 |
| `p-6` | 24px | 대시보드 메인 패딩 |

### Grid Alignment 규칙
- **항상 grid 또는 flex + container 조합** 사용
- **카드들의 상단/하단 라인은 반드시 일치**해야 함
- **좌우 여백은 동일** — 한쪽만 넓어지는 레이아웃 금지
- **섹션 간 간격은 24px(`gap-6`) 또는 32px(`gap-8`)으로 통일**

```tsx
/* ✅ 올바른 정렬 */
<div className="mx-auto w-full max-w-screen-xl px-4 lg:px-8">
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <Card>...</Card>
    <Card>...</Card>
    <Card>...</Card>
    <Card>...</Card>
  </div>
</div>
```

### Page Padding
- Marketing: `py-24 md:py-32` (Hero 섹션)
- Dashboard: `p-4 lg:p-6` (메인 콘텐츠)

---

## 5. Component Usage Rules — 라운드 박스

> **모든 박스 컴포넌트는 둥근 모서리를 적용합니다.** 직각(`rounded-none`)은 절대 사용하지 않습니다.

### Global Radius
- `--radius: 0.875rem` (14px) — 기본 라운드 값
- `Card`: `rounded-xl` (14px)
- `Button`: `rounded-lg` (11.2px) 또는 `rounded-md` (7px)
- `Input`: `rounded-md` (7px)
- `Badge`: `rounded-full` (완전 둥근 뱃지)
- `Sheet/Modal`: `rounded-xl` (14px)

### Button

| Variant | Usage | Rounded |
|---------|-------|---------|
| `default` | 메인 CTA, Submit | `rounded-lg` |
| `outline` | 보조 액션, Cancel | `rounded-lg` |
| `ghost` | 네비게이션, 아이콘 버튼 | `rounded-md` |
| `destructive` | 삭제, 위험한 액션 | `rounded-lg` |
| `link` | 텍스트 링크 | — |

```tsx
<Button size="lg" className="rounded-lg">Primary CTA</Button>
<Button variant="outline" size="sm" className="rounded-lg">Cancel</Button>
<Button variant="ghost" asChild className="rounded-md"><Link href="/">Nav</Link></Button>
```

### Card — 반드시 rounded 적용

```tsx
<Card className="rounded-xl">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badge (Sentiment)

| Sentiment | Badge Variant | Rounded |
|-----------|--------------|---------|
| positive | `default` (primary) | `rounded-full` |
| negative | `destructive` | `rounded-full` |
| neutral | `secondary` | `rounded-full` |

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="rounded-lg">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Input

```tsx
<Input 
  placeholder="Search..." 
  className="rounded-md bg-background pl-8" 
/>
```

### Icons

- **라이브러리**: `lucide-react`만 사용
- **사이즈**: 기본 `h-4 w-4`, 헤더 아이콘 `h-5 w-5`, Hero `h-8 w-8`
- **색상**: `text-primary`, `text-muted-foreground`, `text-destructive`

---

## 6. Responsive Breakpoints

| Breakpoint | Tailwind | Usage |
|-----------|----------|-------|
| Mobile | 기본 | 1열 레이아웃, stacked nav |
| Tablet | `md:` (768px) | 2열 그리드, 사이드바 표시 |
| Desktop | `lg:` (1024px) | 4열 그리드, 전체 레이아웃 |

### 규칙
- Mobile First: 기본 스타일은 모바일, `md:`/`lg:`로 확장
- 사이드바: `hidden md:flex` (모바일에서는 Sheet drawer)
- 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Container는 모든 브레이크포인트에서 `max-w-screen-xl` 유지**

---

## 7. Layout Patterns

### Marketing Page
```
Header (sticky, rounded-none)
  └─ Logo + Nav Links
Main
  └─ Hero Section (centered, large text, container mx-auto)
  └─ Features Grid (4 cards, gap-6, rounded-xl)
Footer
  └─ Copyright
```

### Dashboard Page
```
Sidebar (fixed left, 64px, rounded-none)
  └─ Logo
  └─ Nav Items (icon + text, rounded-md)
Header (sticky top, rounded-none)
  └─ Mobile Menu Button (Sheet, rounded-md)
  └─ Search Input (rounded-md)
  └─ Notification Bell (rounded-full)
Main Content
  └─ Stats Cards (4 col grid, gap-4, rounded-xl)
  └─ Chart Card (rounded-xl)
  └─ Table Card (rounded-xl)
```

---

## 8. Animation & Transition

- **Hover**: `hover:bg-accent`, `hover:text-accent-foreground`, `transition-colors`
- **Focus**: `focus-visible:ring-1 focus-visible:ring-ring`
- **Sheet/Modal**: `duration-200 ease-in-out`
- **Skeleton**: shadcn/ui `Skeleton` 컴포넌트 사용 (추가 필요 시), `rounded-xl` 적용

---

## 9. Do's & Don'ts

### ✅ Do
- shadcn/ui 컴포넌트를 먼저 검색해서 사용 (`npx shadcn@latest add <component>`)
- `cn()` 유틸로 클래스 병합
- `lucide-react` 아이콘만 사용
- `--primary` (CITI 짙은 파랑)으로 강조
- **모든 Card, Button, Input에 rounded 적용**
- **항상 `container mx-auto max-w-screen-xl`로 정렬**
- 모바일 먼저 반응형 설계

### ❌ Don't
- 직접 HEX 색상 사용 (`#000`, `#fff` 등)
- 인라인 스타일 (`style={{...}}`)
- `lucide-react` 외의 아이콘 라이브러리 추가
- `px` 단위 하드코딩 (Tailwind spacing scale 사용)
- 각 페이지마다 다른 디자인 패턴 사용
- **직각 박스 사용 (`rounded-none`)**
- **콘텐츠를 화면 끝까지 늘리기 (`w-full` without container)**

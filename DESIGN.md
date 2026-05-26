# Geo Platform — Design System

> AI 에이전트와 개발자가 UI를 구축할 때 따르는 디자인 규칙서입니다.

---

## 1. Design Philosophy

- **Minimal & Professional** — 불필요한 장식 제거, 정보 전달 우선
- **Consistent Spacing** — 4px 기반의 체계적인 간격
- **Accessible** — WCAG 2.1 AA 수준 준수 (명도 대비, 키보드 네비게이션)
- **Responsive First** — Mobile → Tablet → Desktop 순서로 구현

---

## 2. Color System

shadcn/ui v4 CSS Variables를 사용합니다. 직접 HEX/RGB를 쓰지 마세요.

### Base Colors (Light Mode)

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Background | `--background` | 페이지 전체 배경 |
| Foreground | `--foreground` | 기본 텍스트 |
| Primary | `--primary` | 메인 CTA, 활성 상태 |
| Primary Foreground | `--primary-foreground` | Primary 위의 텍스트 |
| Secondary | `--secondary` | 보조 버튼, 태그 |
| Muted | `--muted` | 비활성 배경, 구분선 영역 |
| Border | `--border` | 카드/입력창 테두리 |
| Destructive | `--destructive` | 삭제, 에러, 부정적 감성 |
| Card | `--card` | 카드 컴포넌트 배경 |
| Sidebar | `--sidebar` | 사이드바 배경 |

### Chart Colors (Data Visualization)

| Token | Variable | Usage |
|-------|----------|-------|
| Chart 1 | `--chart-1` | 주요 데이터 시리즈 |
| Chart 2 | `--chart-2` | 보조 데이터 시리즈 |
| Chart 3~5 | `--chart-3`~`--chart-5` | 추가 시리즈 |

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
| Body | Geist Sans | 400 | `text-sm` (14px) |
| Heading 1 | Geist Sans | 700 | `text-3xl` / `md:text-6xl` |
| Heading 2 | Geist Sans | 700 | `text-2xl` |
| Heading 3 | Geist Sans | 600 | `text-lg` |
| Card Title | Geist Sans | 500 | `text-sm` |
| Mono/Code | Geist Mono | 400 | `text-sm` |

### 규칙
- **한국어/영어 혼용** 시 `lang="ko"` 속성 유지
- `tracking-tight`를 제목에 사용하여 타이트한 느낌
- `text-muted-foreground`를 보조 텍스트에 사용

---

## 4. Spacing & Layout

### Container
```
container mx-auto px-4 lg:px-6
```

### Spacing Scale (Tailwind 기본)
| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | 아이콘과 텍스트 사이 |
| `gap-2` | 8px | 버튼 그룹 낮은 밀도 |
| `gap-4` | 16px | 카드 그리드, 일반 간격 |
| `gap-6` | 24px | 섹션 간 간격 |
| `p-4` | 16px | 카드 낶 패딩 |
| `p-6` | 24px | 대시보드 메인 패딩 |

### Page Padding
- Marketing: `py-24 md:py-32` (Hero 섹션)
- Dashboard: `p-4 lg:p-6` (메인 콘텐츠)

---

## 5. Component Usage Rules

### Button

| Variant | Usage |
|---------|-------|
| `default` | 메인 CTA, Submit |
| `outline` | 보조 액션, Cancel |
| `ghost` | 네비게이션, 아이콘 버튼 |
| `destructive` | 삭제, 위험한 액션 |
| `link` | 텍스트 링크 |

```tsx
<Button size="lg">Primary CTA</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" asChild><Link href="/">Nav</Link></Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badge (Sentiment)

| Sentiment | Badge Variant |
|-----------|--------------|
| positive | `default` (primary) |
| negative | `destructive` |
| neutral | `secondary` |

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Input

```tsx
<Input placeholder="Search..." className="bg-background pl-8" />
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

---

## 7. Layout Patterns

### Marketing Page
```
Header (sticky)
  └─ Logo + Nav Links
Main
  └─ Hero Section (centered, large text)
  └─ Features Grid (4 cards)
Footer
  └─ Copyright
```

### Dashboard Page
```
Sidebar (fixed left, 64px)
  └─ Logo
  └─ Nav Items (icon + text)
Header (sticky top)
  └─ Mobile Menu Button (Sheet)
  └─ Search Input
  └─ Notification Bell
Main Content
  └─ Stats Cards (4 col grid)
  └─ Chart Card
  └─ Table Card
```

---

## 8. Animation & Transition

- **Hover**: `hover:bg-accent`, `hover:text-accent-foreground`
- **Focus**: `focus-visible:ring-1 focus-visible:ring-ring`
- **Sheet/Modal**: `duration-200 ease-in-out`
- **Skeleton**: shadcn/ui `Skeleton` 컴포넌트 사용 (추가 필요 시)

---

## 9. Do's & Don'ts

### ✅ Do
- shadcn/ui 컴포넌트를 먼저 검색해서 사용 (`npx shadcn@latest add <component>`)
- `cn()` 유틸로 클래스 병합
- `lucide-react` 아이콘만 사용
- `--primary` 색상으로 강조
- 모바일 먼저 반응형 설계

### ❌ Don't
- 직접 HEX 색상 사용 (`#000`, `#fff` 등)
- 인라인 스타일 (`style={{...}}`)
- `lucide-react` 외의 아이콘 라이브러리 추가
- `px` 단위 하드코딩 (Tailwind spacing scale 사용)
- 각 페이지마다 다른 디자인 패턴 사용

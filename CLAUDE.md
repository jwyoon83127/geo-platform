# Claude — Agent Guidelines for Geo Platform

> 이 문서는 Claude(Anthropic) 에이전트가 Geo Platform을 작업할 때의 추가 규칙입니다.  
> 기본 규칙은 `AGENTS.md`를 참고하세요.

---

## 1. Always Check AGENTS.md First

코드 변경 전 **반드시** `AGENTS.md`를 확인하여 다음을 준수하세요:
- 프로젝트 폴더 구조
- Supabase 클라이언트 사용 규칙
- shadcn/ui 컴포넌트 사용법
- API Route 작성 패턴

---

## 2. Plan Mode Usage

다음 상황에서 **반드시 Plan Mode**를 사용하세요:

- 새로운 페이지/레이아웃 추가
- 인증(Auth) 시스템 구축
- 결제(Stripe) 플로우 추가
- 데이터베이스 스키마 변경 (새 테이블, 컬럼 추가)
- 외부 API 연동 (OpenAI, Anthropic, Resend)

Plan Mode 사용 시:
1. `AGENTS.md`의 아키텍처를 준수하는지 확인
2. 2~3개의 구현 옵션 제시
3. 사용자가 선택한 후에만 코드 작성 시작

---

## 3. Code Generation Rules

### Next.js 16 Specifics
- **Training data는 과거 버전**일 수 있음. 항상 `node_modules/next/dist/docs/`의 최신 문서를 우선으로 따름
- **Turbopack**이 기본 번들러 — webpack 설정 불필요
- **Tailwind v4** — `tailwind.config.js` 없이 CSS 기반 설정 (`globals.css`)

### TypeScript
- `strict: true` 활성화됨 — `any` 사용 최소화
- API Response 타입은 `src/types/`에 정의
- DB 타입은 `supabase gen types`로 자동 생성 권장

### React 19
- Server Components가 기본
- `use` hook 활용 가능 (React 19)
- `forwardRef` 대신 `ref` prop 직접 전달 가능 (대부분의 케이스)

---

## 4. Sub-Agent Delegation

Claude가 직접 하지 말고 **서브 에이전트에게 위임**할 작업:

| 작업 | 에이전트 | 이유 |
|------|----------|------|
| 코드베이스 전체 구조 파악 | `explore` | 파일 수가 많을 때 효율적 |
| 신규 API Route 2개 이상 동시 구현 | `coder` (병렬) | 독립적 작업 가능 |
| Auth 시스템 아키텍처 설계 | `plan` | 구현 전 설계 검토 필요 |
| 리팩토링 (3개 이상 파일 영향) | `explore` → `coder` | 영향 범위 파악 후 실행 |

### Delegation Pattern
```
User: "Auth 시스템 만들어줘"
→ Plan Mode 진입
→ explore로 현재 인증 관련 코드/구조 파악
→ plan으로 설계안 작성
→ 사용자 승인
→ coder로 구현 (병렬: login 페이지, middleware, API)
```

---

## 5. Validation & Testing

코드 작성 후 **반드시** 수행:

1. **Build Test**: `npm run build` — TypeScript 에러와 빌드 실패 방지
2. **Lint Check**: ESLint 설정 추가 시 `npm run lint`
3. **API Test**: 새 API Route 작성 후 `curl`로 동작 확인
4. **UI Check**: shadcn/ui 컴포넌트 수정 후 브라우저 확인

---

## 6. Security Checklist

새 기능 추가 시 매번 확인:

- [ ] `.env.local`에 새로운 API Key 추가 시 `.env.local.example`도 업데이트
- [ ] Supabase `service_role` 키를 Client Component에서 사용하지 않음
- [ ] API Route에서 사용자 입력값 검증 (Zod 등)
- [ ] RLS 정책이 필요한 새 테이블에 반드시 추가
- [ ] Stripe webhook secret 노출 방지

---

## 7. Decision Matrix — When to Ask vs Act

Claude가 스스로 판단하여 **즉시 실행**할지, **사용자에게 보고**할지 기준입니다.

| 우선순위 | 행동 | 예시 |
|---------|------|------|
| **P0: 즉시 실행** | 별도 승인 없이 바로 코드 작성/수정 | shadcn 컴포넌트 추가, 패키지 설치, 빌드 에러 수정, UI 조정, 파일 생성 |
| **P1: 보고 후 진행** | "이렇게 하겠습니다" 라고 알리고 3초 내 실행 | API 추가, DB 마이그레이션, 새 페이지 생성, 리팩토링 |
| **P2: 승인 후 진행** | 사용자가 "OK" 또는 "ㅇㅇ" 할 때까지 대기 | 스키마 변경, 보안 정책 변경, 비용 발생 기능, 외부 서비스 연동 |
| **P3: 절대 금지** | 사용자가 직접 요청 필수 | 프로덕션 배포, `.env` 실제값 노출, DB 삭제, 강제 푸시 |

### 기본 태도

> **"이건 내가 결정할 수 있는 범위다"** → 바로 한다  
> **"이건 사용자의 도메인이다"** → 보고 또는 묻는다  
> **"이건 위험할 수 있다"** → 반드시 승인받는다

---

## 8. Communication Style

- 기술적 결정은 **근거**와 함께 설명 ("왜 이 방식인가")
- 에러 발생 시 **원인 → 해결책 → 예방책** 순서로 보고
- 사용자가 "그냥 해줘"라고 해도, Plan Mode가 필요한 작업은 설계안 먼저 제시

# CY Portfolio 설계 문서

- **작성일**: 2026-08-26
- **버전**: v1.0
- **레포**: `cy-portfolio`
- **상태**: 승인 완료 → 구현 계획 작성 대기

---

## 1. 목적

이직·구직용 포트폴리오 사이트를 신규 제작한다.

현재 포트폴리오(`chanyong.netlify.app`)는 **React 18 + Vite SPA**로 만들어져 있으나,
지원하려는 포지션과 실제 주력 기술은 **Vue3 / Nuxt3 / 디자인 시스템**이다.
포트폴리오라는 산출물 자체가 포지셔닝과 어긋나 있는 상태를 해소한다.

### 성공 기준

| 기준 | 측정 |
|------|------|
| 포지셔닝 일치 | 사이트가 Nuxt3 + 자체 디자인 시스템으로 제작됨 |
| 검증 가능성 | 면접관이 로그인 없이 `ispark-ui` 컴포넌트를 직접 조작 가능 |
| 링크 가능성 | 모든 프로젝트가 고유 URL을 가져 이력서에 직접 기재 가능 |
| 접근성 | Lighthouse 접근성 100점 |
| 색인 | 프로젝트 본문이 검색엔진에 색인됨 (현재 CSR로 불가) |

---

## 2. 배경 — 기존 사이트의 문제

`box3101/cy-frontend-works` (React + Vite, `"name": "react-portfolio"`) 분석 결과.

| 문제 | 근거 | 영향 |
|------|------|------|
| 기술 스택 불일치 | React SPA / 주력은 Vue3·Nuxt3 | 포지셔닝 신뢰도 하락 |
| URL 부재 | 슬라이드 네비게이션, 라우트 미분리 | 이력서에 프로젝트 상세 링크 기재 불가 |
| SEO 불가 | CSR 전용 | 본문 색인 안 됨 |
| 접근성 미달 | 화살표 기반 섹션 이동, 키보드 탐색 불가 | **웹접근성 인증 3회 보유자의 사이트가 접근성 미달** |
| Mixed Content | `http://www.ivang-design.com/svg-load/portfolio/*.svg` 외부 참조 | 콘솔 경고 2건, 외부 서버 의존 |
| Manifest 오류 | `site.webmanifest` 문법 오류 | 콘솔 에러 1건 |

---

## 3. 자산 인벤토리

### 3.1 핵심 자산

| 자산 | 내용 | 검증 |
|------|------|------|
| **`@leechanyong/ispark-ui`** | Vue3 + radix-vue 디자인 시스템. 컴포넌트 32개 / 스토리 280+ / 가이드 문서 6개 / `index.d.ts` 제공 / MIT | npm v0.5.16 퍼블리시, GitHub Pages Storybook |
| **TaskFlow** | 풀스택 프로젝트 관리 앱. Vue3+TS+Vite+ispark-ui+Pinia / Express+TS+Prisma+PostgreSQL+JWT | Railway 배포, 본인 상시 사용 중 |
| **이즈파크 Sgate** | 성과관리 솔루션. Vue3/Nuxt3/Pinia, 디자인 컴포넌트 시스템 구축 | 2025.03~ 진행중 |
| 인증서·심사결과서 | 웹접근성 인증 3회, 웹품질 우수등급, 공공기관 심사결과서 다수 (2021~2023) | PDF 보유 |
| 기존 프로젝트 데이터 | `Portfolio.jsx` 내 구조화된 객체 배열 **17건** | 마이그레이션 가능 |

기존 17건 내역:

| 구분 | 건수 | 항목 |
|------|------|------|
| 실무 프로젝트 | 9 | sgate-okr-solution, yeonsu-library-website, incheon-city, korean-bank-evaluation, incheon-jung-gu-edu, g4b-business-support, ict-ksa-system, samsung-sdi-gsop, crm-pocket-camp-frontend |
| 개인·토이 | 4 | react-portfolio, okr-solution-development, animal-flash-cards, company-portfolio-landing |
| JS 시각화 학습자료 | 3 | event-loop-visualization, promise-visualization, async-await-visualization |
| 블로그 링크 카드 | 1 | cy-tech-blog |

신규 편입 3건: `ispark-ui`, `TaskFlow`, `movie-dashboard`

### 3.2 `ispark-ui`의 위치 (서술 기준)

이즈파크 Sgate 실무에서 구축한 디자인 시스템과 **구조는 유사하되 코드는 재작성**한 개인 프로젝트다.
포트폴리오 서술은 **"실무 경험을 개인 프로젝트로 재설계"**로 통일한다.
회사 코드를 그대로 공개한 것이 아님을 명확히 하고, 회사 내부 화면·데이터는 포함하지 않는다.

### 3.3 서사 축

```
ispark-ui   →  시스템을 만들었다        (npm에서 즉시 검증 가능)
TaskFlow    →  그 시스템으로 제품을 만들었다  (라이브 링크로 즉시 확인)
Sgate       →  실무에도 적용했다        (경력 증명)
이 사이트    →  이 사이트도 그 시스템으로 만들었다  (도그푸딩)
```

---

## 4. 범위

### 포함

- 공개 사이트: 홈 / 프로젝트 목록 / 프로젝트 상세 / 디자인 시스템 쇼케이스 / 아카이브 / 소개
- 관리자: 인증, 프로젝트·아카이브·프로필 CRUD, 방문 통계 대시보드
- Supabase 스키마 및 Storage
- 프로젝트 데이터 마이그레이션 (기존 17건 중 선별 + 신규 3건)

### 제외

| 제외 항목 | 사유 |
|-----------|------|
| **기술블로그 이전** | Notion 글 추출·마크다운 변환·이미지 재호스팅이 독립 프로젝트 규모. **별도 스펙으로 분리** |
| `/admin/demo` 게스트 모드 | Phase 3 완료 후 재검토 |
| 다국어(i18n) | 국내 구직 대상 |
| 댓글·방명록 | 운영 부담 대비 효용 낮음 |

---

## 5. 아키텍처

### 5.1 스택

| 레이어 | 선택 |
|--------|------|
| 프레임워크 | **Nuxt 3** (SSR/ISR) |
| UI | **`@leechanyong/ispark-ui`** |
| 데이터 | **Supabase** (Postgres + Auth + Storage) |
| 배포 | **Vercel** (기본 도메인 `*.vercel.app`) |
| 애니메이션 | `motion-v` (framer-motion Vue 포팅), Intersection Observer |

### 5.2 렌더링 전략

```ts
// nuxt.config.ts
routeRules: {
  '/':              { isr: 3600 },
  '/projects':      { isr: 3600 },
  '/projects/**':   { isr: 3600 },
  '/archive':       { isr: 3600 },
  '/about':         { isr: 3600 },
  '/design-system': { ssr: true  },   // 인터랙션 중심, 캐시 제외
  '/admin/**':      { ssr: false },   // CSR 전용
}
```

`/admin`을 CSR로 두는 이유: 인증 뒤라 SEO가 불필요하고,
`UiMarkdownEditor`(TipTap) · `UiChart`(Chart.js)의 SSR hydration 충돌 위험을 원천 제거한다.

### 5.3 ispark-ui SSR 대응

```ts
build: { transpile: ['@leechanyong/ispark-ui'] }
```
```vue
<!-- app.vue -->
import '@leechanyong/ispark-ui/style.css'
```

| 컴포넌트 | 처리 |
|---------|------|
| `UiMarkdownEditor` (TipTap) | `<ClientOnly>` 또는 CSR 라우트 전용 |
| `UiChart` (Chart.js) | `<ClientOnly>` + fallback |
| radix-vue 계열 (Modal/Dropdown/Tooltip/Select) | SSR 가능 추정, **Teleport 동작 검증 필요** |

> ⚠️ 위 표의 radix-vue 항목은 **미검증 가정**이다.
> Phase 0에서 32개 컴포넌트 SSR 스모크 테스트를 선행한다.
> 문제 발견 시 `ispark-ui` 자체를 수정하며, 이 또한 포트폴리오 서사에 편입한다.

---

## 6. 사이트 구조

### 6.1 공개 영역

| 라우트 | 화면 | 목적 | 주요 ispark-ui |
|--------|------|------|---------------|
| `/` | 홈 | 3초 내 각인 | UiBadge, UiButton |
| `/projects` | 프로젝트 목록 | 필터 탐색 | UiTab, UiBadgeGroup, UiPagination |
| `/projects/[slug]` | 프로젝트 상세 | 문제→해결→성과 | UiTable, UiBadge |
| `/design-system` | 디자인 시스템 쇼케이스 | 시스템 역량 증명 | 전 컴포넌트 |
| `/archive` | 인증서·자료 | 실물 증명 | UiTable, UiFileList, UiModal |
| `/about` | 소개·경력·스킬 | 인물 파악 | UiAccordion, UiProgress |

**필터 상태는 URL 쿼리에 반영한다** (`/projects?category=vue-nuxt`).

### 6.2 관리자 영역

| 라우트 | 화면 | 주요 ispark-ui |
|--------|------|---------------|
| `/admin` | 대시보드 | UiChart, UiEmpty |
| `/admin/projects` | 프로젝트 CRUD | UiTable, UiModal, UiInput, UiTextarea, UiMultiSelect, UiDateRangePicker, UiFileUpload, UiToast, UiConfirm |
| `/admin/archive` | 자료 CRUD | UiFileUpload, UiFileList, UiSelect, UiDatePicker |
| `/admin/profile` | 프로필·스킬·경력 | UiInput, UiMarkdownEditor, UiToggle, UiRadio |

### 6.3 `/design-system`의 역할

Storybook과 중복이 아니다.

| | Storybook | `/design-system` |
|---|---|---|
| 대상 | 개발자 | 채용담당자 |
| 성격 | 컴포넌트 카탈로그, props 문서 | "이 시스템으로 화면이 만들어진다"는 증명 |
| 진입 | 별도 사이트 | 포트폴리오 내부, 로그인 불필요 |

**accent 토큰 실시간 교체 데모를 포함한다.** 스와치 클릭 시 CSS 변수 하나로 페이지 전체 색이 바뀌며,
라이브러리의 `Theming` 문서가 문장이 아니라 동작으로 증명된다.

---

## 7. 데이터 모델

### `projects`

| 컬럼 | 타입 | 비고 |
|------|------|------|
| `id` | uuid PK | |
| `slug` | text UNIQUE | 기존 `Portfolio.jsx`의 `id` 값 승계 |
| `title` / `subtitle` / `summary` | text | 카드 노출 |
| `category` | text | `vue-nuxt` / `astro` / `react` / `publisher` |
| `period_start` / `period_end` | date | **`period_end IS NULL` = 진행중** |
| `content` | text | 마크다운 상세 |
| `thumbnail_path` | text | Storage 경로 |
| `repo_url` / `live_url` | text | nullable |
| `tags` | text[] | GIN 인덱스. 조인 테이블 미사용 |
| `role` | text | 담당 역할 |
| `sort_order` | int | 어드민 정렬 |
| `is_featured` | bool | 홈 노출 |
| `is_published` | bool | 초안 관리 |
| `created_at` / `updated_at` | timestamptz | |

### `archives`

`title` / `doc_type`(증명서·포트폴리오·기타) / `issuer` / `issued_on` / `file_path` / `thumbnail_path` / `description` / `is_published` / `sort_order`

PDF 1페이지를 이미지로 추출해 `thumbnail_path`에 저장하고, 목록은 썸네일 그리드로 렌더링한다.
원본 PDF는 `UiModal` 내부 뷰어에서만 로드한다.

### `careers`
`company` / `position` / `period_start` / `period_end` / `description`(md) / `sort_order`

### `skills`
`name` / `category`(language·framework·tool·design) / `level`(1~5) / `sort_order`

### `profile` — 단일 row (id=1 고정)
`name` / `headline` / `bio`(md) / `email` / `github_url` / `blog_url` / `resume_path` / `avatar_path`

### `page_views`
`path` / `referrer` / `created_at` — `/admin` 대시보드 차트의 실제 데이터 소스

> 더미 데이터로 차트를 채우지 않는다. 실제 방문 로그만 사용한다.

### Storage 버킷

| 버킷 | 공개 | 용도 |
|------|------|------|
| `thumbnails` | public | 프로젝트 썸네일 |
| `documents` | public | 인증서 PDF |
| `profile` | public | 아바타, 이력서 |

### RLS

- `SELECT`: `is_published = true` 인 행만 `anon` 허용
- `INSERT` / `UPDATE` / `DELETE`: `authenticated` 만 허용
- 회원가입 비활성화, 계정 1개

---

## 8. 코드 규칙

`CLAUDE.md` 규칙을 따르되, **SSR 환경에 맞춰 상태 선언 방식만 변경**한다.

### 8.1 상태 선언 — `ref` → `useState`

기존 규칙의 모듈 스코프 `ref` 패턴은 SPA에서는 안전하나, **Nuxt3 SSR에서는 서버 프로세스 전역이 되어
요청 간 상태가 공유된다**(cross-request state pollution). 미공개 초안이 타 방문자에게 노출될 수 있다.

```ts
// composables/store/useProjectStore.ts

// ===== 상태 변수 =====
const projectList = useState<Project[]>('project/list', () => [])
const selectedProject = useState<Project | null>('project/selected', () => null)
```

`useState`는 Nuxt가 요청별로 격리하는 ref이며, 사용 측 코드는 `ref`와 동일하다.
**composable 반환 패턴 / Pinia 미사용 / storeToRefs 미사용 규칙은 그대로 유지한다.**

### 8.2 레이어 구조

```
composables/
├── useSupabase.ts              # 클라이언트 + 공통 에러 처리 (useApi 역할)
├── api/
│   ├── useProjectApi.ts        # fetch~
│   ├── useArchiveApi.ts
│   ├── useProfileApi.ts
│   └── useStatsApi.ts
└── store/
    ├── useProjectStore.ts      # handle~
    ├── useArchiveStore.ts
    └── useProfileStore.ts
```

### 8.3 네이밍 (CLAUDE.md 규칙 그대로)

| 접두사 | 용도 |
|--------|------|
| `fetch~` | API 호출 (api 레이어) |
| `handle~` | store action |
| `on~` | 이벤트 핸들러 / emit |
| `do~` | confirm 후 실행 |
| `open~` | 모달 열기 |
| `is~` / `has~` | boolean |
| `toggle~` | on/off |

### 8.4 구분선

api 파일은 `// ===== 도메인명 =====`, store 파일은 `// ===== 섹션명 =====` 로 영역을 구분한다.
주석은 한국어로 작성한다.

### 8.5 에러 처리

`useSupabase`에서 일괄 캐치 후 **`UiToast`**로 노출한다.
API 실패 시 샘플·폴백 데이터로 대체하지 않는다. 빈 상태(`UiEmpty`)를 렌더링하고 에러를 남긴다.

### 8.6 인증

`@nuxtjs/supabase` + `middleware/auth.ts` 로 `/admin/**` 세션 가드.

---

## 9. 디자인 방향

### 9.1 유지 (기존 비주얼 임팩트)

- 풀스크린 히어로 + 대형 타이포, `Cy's Code Canvas` 아이덴티티
- 커스텀 커서 (데스크톱 한정)
- 페이지 전환 애니메이션 (`framer-motion` → `motion-v`)
- 다크 테마 기반, 기존 마젠타 계열 accent

### 9.2 변경 (구조)

| 대상 | 변경 |
|------|------|
| 슬라이드 네비게이션 | **제거** → 상단 고정 GNB + 일반 스크롤, 라우트 = URL |
| 외부 도메인 SVG | **제거** → 로컬 에셋으로 교체 |
| `site.webmanifest` | 문법 오류 수정 |

### 9.3 토큰

`ispark-ui`의 CSS 변수를 베이스로 사용하고 브랜드 컬러만 오버라이드한다.
이로써 `/design-system`의 테마 토글이 사이트 전체에 실시간 반영된다.

중성색은 accent 방향으로 미세하게 기울인 색을 사용한다(순수 회색 미사용).

### 9.4 접근성

- 라이트/다크 두 테마 모두 설계. `prefers-color-scheme` 및 명시적 토글 모두 지원
- `prefers-reduced-motion` 대응 (커스텀 커서·전환 애니메이션 비활성 경로)
- 키보드 포커스 가시 상태 필수

### 9.5 참고 목업

`https://claude.ai/code/artifact/fcf6b2b7-b909-4dd6-a391-cc66ea9c5c65`
(홈 / 프로젝트 목록 / 디자인 시스템 3개 화면)

---

## 10. 품질 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| Lighthouse 접근성 | **100** | 미측정 |
| Lighthouse 성능 | 90+ | 미측정 |
| LCP | < 2.5s | 미측정 |
| 콘솔 에러 | **0** | 2건 |
| 콘솔 경고 | 0 | 2건 |

접근성 100점은 선택이 아니다. 웹접근성 인증 3회를 `/archive`에 게시하는 사이트가
정작 접근성 미달이면 자산이 아니라 역효과가 된다.

---

## 11. 로드맵

### Phase 0 — 검증 & 리스크 제거 (1주)

| 작업 | 우선순위 |
|------|---------|
| TaskFlow 데모 계정 + 시드 데이터 분리 | 🚨 최우선 |
| 인증서 PDF 개인정보 마스킹 검수 | 🚨 최우선 |
| `ispark-ui` README 갱신 | ⚠️ 높음 |
| `ispark-ui` 32개 컴포넌트 Nuxt3 SSR 스모크 테스트 | ⚠️ 높음 |
| Supabase 프로젝트 생성 + 스키마 마이그레이션 + seed | 기반 |
| Vercel 프로젝트 연결 | 기반 |

### Phase 1 — 공개 사이트 코어 (3~4주)
레이아웃·GNB·푸터·디자인 토큰 → `/` → `/projects` → `/projects/[slug]` → `/about` → SEO(메타·OG·sitemap·robots)

### Phase 2 — 공개 사이트 확장 (2주)
`/archive` (PDF 뷰어) + `/design-system` (쇼케이스 + 테마 토글)

> **6주차: 사이트 완성 = 지원 가능 상태 확보**

### Phase 3 — 어드민 (3주)
Supabase Auth → `/admin/projects` → `/admin/archive` → `/admin/profile` → `/admin` 대시보드

### Phase 4 — 품질 & 전환 (1주)
Lighthouse 측정·개선 → 기존 Netlify 사이트 리다이렉트 처리

**총 10주.**

### 어드민을 Phase 3에 배치한 근거

데이터는 Phase 0부터 Supabase에 존재하며, 미룬 것은 어드민 *화면*뿐이다.
초기 데이터는 프로젝트 20건 내외 + 인증서 10여 건으로 seed SQL 1회 실행으로 충분하다.
어드민을 선행하면 공개 사이트 출시가 3주 지연되며, 구직 중 3주의 지연은 비용이 크다.

---

## 12. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| **TaskFlow 데모 계정 개인정보 노출** | 실계정에 개인 건강 항목·회사 프로젝트명 노출. 채용담당자 전원이 열람 | Phase 0에서 데모 전용 계정 + 시드 분리. 완료 전까지 `LIVE` 배지 및 링크 미게시 |
| **인증서 PDF 내 제3자 정보** | 심사결과서에 발주처 담당자명·연락처·내부 URL 포함 가능성 | Phase 0에서 전수 검수 후 마스킹. 미검수 파일은 게시 보류 |
| **ispark-ui SSR 미검증** | radix-vue Teleport 등 hydration 충돌 시 설계 변경 | Phase 0 스모크 테스트로 선제 확인. 문제 시 라이브러리 수정 |
| **썸네일 이미지 부재** | `Portfolio.jsx`에 이미지 경로 중복(`react-portfolio.png`이 2건에 사용) 및 존재 불확실 경로 존재 | 프로젝트별 화면 캡처 재작업을 Phase 1 태스크로 편성 |
| **Supabase 무료 티어 콜드스타트** | 첫 응답 지연 | 공개 페이지를 ISR로 캐시하여 DB 의존 최소화 |
| **ispark-ui 저작권 오해** | 회사 산출물 공개로 오인될 소지 | 서술을 "실무 경험을 개인 프로젝트로 재설계"로 통일. 회사 화면·데이터 미포함 |

---

## 13. 미결정 사항

| 항목 | 시점 |
|------|------|
| **게재 프로젝트 선별** — 기존 17건 전부 게재할지, 실무 9건 + 신규 3건으로 추릴지. JS 시각화 3건은 `/about` 하위로 분리하는 안도 검토 | Phase 1 착수 전 |
| `/admin/demo` 읽기전용 게스트 모드 도입 여부 | Phase 3 완료 후 |
| 커스텀 도메인 구매 여부 | Phase 4 |
| 기술블로그 이전 방식 | **별도 스펙**으로 분리 |
| 기존 `chanyong.netlify.app` 처리(리다이렉트 / 아카이브 유지) | Phase 4 |

---

## 14. 결정 이력

| 결정 | 선택 | 근거 |
|------|------|------|
| 리뉴얼 vs 신규 | **신규** | 기존이 React SPA로 포지셔닝과 불일치 |
| 아키텍처 | **DB + 어드민 (Supabase)** | 어드민 화면이 ispark-ui 어드민 컴포넌트의 자연스러운 사용처 |
| 배포 | **Vercel + 기본 도메인** | Nuxt3 SSR/ISR 지원, 비용 0 |
| 비주얼 | **임팩트 유지 + 구조 개선** | 기존 강점 보존, 탐색·접근성 문제만 해결 |
| 블로그 | **범위 제외** | 독립 프로젝트 규모 |
| 어드민 시점 | **Phase 3** | 공개 사이트 조기 출시 우선 |

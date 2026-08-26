# Phase 1 — 공개 사이트 코어 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase 데이터를 읽어 렌더링하는 공개 사이트(홈 · 프로젝트 목록/상세 · 소개)를 SSR로 완성한다.

**Architecture:** `useSupabase`(클라이언트 래퍼) → `api/*`(fetch~) → `store/*`(handle~) 3계층. 상태는 SSR 안전한 `useState`로 선언한다. 페이지는 `useAsyncData`로 서버에서 데이터를 채워 HTML에 실어 보낸다.

**Tech Stack:** Nuxt 3 · `@leechanyong/ispark-ui` 0.6.12 · `@supabase/supabase-js` 2.112 · Supabase(Postgres/RLS)

**선행 문서**
- 설계: `docs/superpowers/specs/2026-08-26-portfolio-design.md`
- SSR 검증: `docs/superpowers/notes/2026-08-26-ssr-verification.md` ← **API 실제 시그니처는 여기 §4를 따른다**
- 목업: https://claude.ai/code/artifact/fcf6b2b7-b909-4dd6-a391-cc66ea9c5c65

---

## 설계 판단 — spec §5.3에서 변경

스펙은 `@nuxtjs/supabase` 모듈을 명시했으나 **`@supabase/supabase-js`를 직접 쓰고 자체 래퍼로 감싼다.**

| 이유 | 설명 |
|------|------|
| CLAUDE.md 규칙 일치 | "`useApi` 커스텀 래퍼를 쓰고 `useFetch`/`$fetch`를 직접 쓰지 마라"는 규칙의 정신 그대로. 모듈의 자동 주입보다 명시적 래퍼가 규칙에 부합한다 |
| 미들웨어 간섭 없음 | `@nuxtjs/supabase`는 기본 리다이렉트 미들웨어를 넣는다. Phase 1은 전부 공개 페이지라 불필요하고, 잘못 걸리면 디버깅 비용이 크다 |
| Phase 3 영향 없음 | 인증은 `supabase.auth`로 동일하게 구현 가능하다 |

---

## File Structure

| 파일 | 책임 |
|------|------|
| `composables/useSupabase.ts` | 클라이언트 싱글톤 + 공통 에러 처리 (`useApi` 역할) |
| `composables/api/useProjectApi.ts` | `fetch~` — projects 쿼리 |
| `composables/api/useProfileApi.ts` | `fetch~` — profile · careers · skills |
| `composables/store/useProjectStore.ts` | `handle~` — 프로젝트 상태 |
| `composables/store/useProfileStore.ts` | `handle~` — 프로필 상태 |
| `composables/useTheme.ts` | 테마 토글 (`data-theme` 스탬프 + localStorage) |
| `layouts/default.vue` | GNB · 푸터 · 페이지 전환 |
| `components/layout/TheHeader.vue` | 고정 GNB, 현재 라우트 표시, 테마 토글 |
| `components/layout/TheFooter.vue` | 연락처 · 링크 |
| `components/project/ProjectCard.vue` | 목록/홈 공용 카드 |
| `components/project/ProjectFilter.vue` | 카테고리 필터 (URL 쿼리 동기화) |
| `pages/index.vue` | 홈 |
| `pages/projects/index.vue` | 목록 |
| `pages/projects/[slug].vue` | 상세 |
| `pages/about.vue` | 소개 |
| `utils/period.ts` | 기간 포맷 (`period_end IS NULL` → "진행중") |

---

## Task 1: Supabase 클라이언트 래퍼

**Files:** Create `composables/useSupabase.ts`, `test/supabase.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
// test/supabase.test.ts
import { describe, it, expect } from 'vitest'
import { TEST_BASE_URL } from './config'

describe('Supabase 연동', () => {
  it('홈에서 프로필 이름이 서버 렌더된다', async () => {
    const res = await fetch(`${TEST_BASE_URL}/`)
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain('이찬용')
  })
})
```

- [ ] **Step 2: 실행 → 실패 확인**

```bash
npx vitest run test/supabase.test.ts
```

기대: FAIL (`/` 페이지가 아직 없어 404 → status 200 아님)

- [ ] **Step 3: 클라이언트 래퍼 작성**

```ts
// composables/useSupabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

let client: SupabaseClient<Database> | null = null

/**
 * Supabase 클라이언트 래퍼. CLAUDE.md의 useApi 역할을 한다.
 * 페이지·컴포넌트에서 createClient를 직접 부르지 않는다.
 */
export const useSupabase = () => {
  const config = useRuntimeConfig()

  if (!client) {
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey
    if (!url || !key) {
      throw new Error('Supabase 환경변수가 없습니다. .env의 NUXT_PUBLIC_SUPABASE_* 를 확인하세요.')
    }
    client = createClient<Database>(url, key, {
      auth: { persistSession: false }, // Phase 1은 공개 읽기 전용
    })
  }

  /**
   * 쿼리 실행 + 공통 에러 처리.
   * PostgREST는 RLS로 0건이 되어도 에러를 내지 않으므로 error만 보고 판단하지 않는다.
   */
  const runQuery = async <T>(
    label: string,
    query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  ): Promise<T | null> => {
    const { data, error } = await query
    if (error) {
      console.error(`[supabase] ${label} 실패: ${error.message}`)
      return null
    }
    return data
  }

  return { client, runQuery }
}
```

- [ ] **Step 4: 커밋**

```bash
git add composables/useSupabase.ts test/supabase.test.ts
git commit -m "feat: Supabase 클라이언트 래퍼 추가"
```

---

## Task 2: API · Store 레이어

**Files:** Create `composables/api/useProjectApi.ts`, `composables/api/useProfileApi.ts`, `composables/store/useProjectStore.ts`, `composables/store/useProfileStore.ts`, `utils/period.ts`

- [ ] **Step 1: 기간 포맷 유틸**

```ts
// utils/period.ts

/** '2025-03-01' → '2025.03' */
const toYearMonth = (iso: string): string => {
  const [y, m] = iso.split('-')
  return `${y}.${m}`
}

/**
 * 프로젝트 기간 표기.
 * period_end 가 null 이면 진행중으로 본다.
 */
export const formatPeriod = (start: string, end: string | null): string =>
  end ? `${toYearMonth(start)} — ${toYearMonth(end)}` : `${toYearMonth(start)} — 진행중`

export const isOngoing = (end: string | null): boolean => end === null
```

- [ ] **Step 2: 프로젝트 API**

```ts
// composables/api/useProjectApi.ts
import type { Project, ProjectCategory } from '~/types/database'

export const useProjectApi = () => {
  const { client, runQuery } = useSupabase()

  // ===== Project =====

  /** 공개된 프로젝트 목록. category 가 있으면 해당 분류만. */
  const fetchProjectList = (category?: ProjectCategory) => {
    let query = client
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    return runQuery<Project[]>('프로젝트 목록 조회', query)
  }

  /** 홈에 노출할 대표 작업 */
  const fetchFeaturedProjects = () =>
    runQuery<Project[]>(
      '대표 프로젝트 조회',
      client
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true }),
    )

  /** 상세 1건 */
  const fetchProject = (slug: string) =>
    runQuery<Project>(
      '프로젝트 상세 조회',
      client.from('projects').select('*').eq('slug', slug).eq('is_published', true).single(),
    )

  return { fetchProjectList, fetchFeaturedProjects, fetchProject }
}
```

- [ ] **Step 3: 프로필 API**

```ts
// composables/api/useProfileApi.ts
import type { Profile, Career, Skill } from '~/types/database'

export const useProfileApi = () => {
  const { client, runQuery } = useSupabase()

  // ===== Profile =====
  const fetchProfile = () =>
    runQuery<Profile>('프로필 조회', client.from('profile').select('*').eq('id', 1).single())

  // ===== Career =====
  const fetchCareerList = () =>
    runQuery<Career[]>(
      '경력 조회',
      client.from('careers').select('*').order('sort_order', { ascending: true }),
    )

  // ===== Skill =====
  const fetchSkillList = () =>
    runQuery<Skill[]>(
      '스킬 조회',
      client.from('skills').select('*').order('sort_order', { ascending: true }),
    )

  return { fetchProfile, fetchCareerList, fetchSkillList }
}
```

- [ ] **Step 4: 프로젝트 Store**

모듈 스코프 `ref` 대신 `useState`를 쓴다. SSR에서 요청 간 상태가 공유되는 것을 막기 위함이다(스펙 §8.1).

```ts
// composables/store/useProjectStore.ts
import type { Project, ProjectCategory } from '~/types/database'

export const useProjectStore = () => {
  const { fetchProjectList, fetchFeaturedProjects, fetchProject } = useProjectApi()

  // ===== 상태 변수 =====
  const projectList = useState<Project[]>('project/list', () => [])
  const featuredList = useState<Project[]>('project/featured', () => [])
  const selectedProject = useState<Project | null>('project/selected', () => null)
  const activeCategory = useState<ProjectCategory | 'all'>('project/category', () => 'all')

  // ===== 조회 =====
  const handleSelectProjectList = async () => {
    const category = activeCategory.value === 'all' ? undefined : activeCategory.value
    projectList.value = (await fetchProjectList(category)) ?? []
  }

  const handleSelectFeatured = async () => {
    featuredList.value = (await fetchFeaturedProjects()) ?? []
  }

  const handleSelectProject = async (slug: string) => {
    selectedProject.value = await fetchProject(slug)
  }

  // ===== 이벤트 =====
  const onCategoryChange = async (category: ProjectCategory | 'all') => {
    activeCategory.value = category
    await handleSelectProjectList()
  }

  return {
    projectList,
    featuredList,
    selectedProject,
    activeCategory,
    handleSelectProjectList,
    handleSelectFeatured,
    handleSelectProject,
    onCategoryChange,
  }
}
```

- [ ] **Step 5: 프로필 Store**

```ts
// composables/store/useProfileStore.ts
import type { Profile, Career, Skill } from '~/types/database'

export const useProfileStore = () => {
  const { fetchProfile, fetchCareerList, fetchSkillList } = useProfileApi()

  // ===== 상태 변수 =====
  const profile = useState<Profile | null>('profile/data', () => null)
  const careerList = useState<Career[]>('profile/careers', () => [])
  const skillList = useState<Skill[]>('profile/skills', () => [])

  // ===== 조회 =====
  const handleSelectProfile = async () => {
    profile.value = await fetchProfile()
  }

  const handleSelectAbout = async () => {
    const [p, c, s] = await Promise.all([fetchProfile(), fetchCareerList(), fetchSkillList()])
    profile.value = p
    careerList.value = c ?? []
    skillList.value = s ?? []
  }

  return { profile, careerList, skillList, handleSelectProfile, handleSelectAbout }
}
```

- [ ] **Step 6: 커밋**

```bash
git add composables/ utils/
git commit -m "feat: 프로젝트·프로필 API 및 Store 레이어 추가"
```

---

## Task 3: 레이아웃 (GNB · 푸터 · 테마 토글)

**Files:** Create `composables/useTheme.ts`, `components/layout/TheHeader.vue`, `components/layout/TheFooter.vue`, `layouts/default.vue`

상세 마크업은 목업(아티팩트)의 GNB 구조를 따른다. 슬라이드 네비게이션을 쓰지 않고 라우트 기반으로 만든다.

- [ ] **Step 1: 테마 composable**

```ts
// composables/useTheme.ts
type Theme = 'light' | 'dark'

export const useTheme = () => {
  // SSR에서는 시스템 설정을 알 수 없다. 스탬프 없이 두고 클라이언트에서 복원한다.
  const theme = useState<Theme | null>('theme', () => null)

  const applyTheme = (next: Theme) => {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', next)
      try {
        localStorage.setItem('theme', next)
      } catch {
        // 프라이빗 모드 등에서 실패할 수 있다. 무시한다.
      }
    }
  }

  const restoreTheme = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') applyTheme(saved)
    } catch {
      // 무시
    }
  }

  const toggleTheme = () => {
    const current =
      theme.value ??
      (import.meta.client && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(current === 'dark' ? 'light' : 'dark')
  }

  return { theme, applyTheme, restoreTheme, toggleTheme }
}
```

- [ ] **Step 2~4:** `TheHeader.vue` / `TheFooter.vue` / `layouts/default.vue` 작성
- [ ] **Step 5:** 커밋

---

## Task 4: 홈 (`/`)

**Files:** Create `pages/index.vue`, `components/project/ProjectCard.vue`

목업의 홈 구조를 따른다: 히어로(대형 타이포 + 그리드 모티프) → 검증 숫자 4개 → 대표 작업 3건.

- [ ] **Step 1:** `ProjectCard.vue` 작성 (`formatPeriod` 사용, LIVE/NPM 배지)
- [ ] **Step 2:** `pages/index.vue` — `useAsyncData`로 프로필·대표작업 SSR 로딩
- [ ] **Step 3:** `npx vitest run test/supabase.test.ts` → PASS 확인
- [ ] **Step 4:** 커밋

---

## Task 5: 프로젝트 목록 (`/projects`)

**Files:** Create `pages/projects/index.vue`, `components/project/ProjectFilter.vue`

- [ ] **Step 1:** 필터 컴포넌트 — 선택 시 `router.replace({ query: { category } })`로 URL에 반영
- [ ] **Step 2:** 페이지 — `route.query.category`를 초기값으로 읽어 SSR
- [ ] **Step 3:** 테스트 추가 — `/projects?category=vue-nuxt` 응답에 해당 분류만 있는지
- [ ] **Step 4:** 커밋

---

## Task 6: 프로젝트 상세 (`/projects/[slug]`)

**Files:** Create `pages/projects/[slug].vue`

- [ ] **Step 1:** `useAsyncData`로 slug 조회, 없으면 `createError({ statusCode: 404 })`
- [ ] **Step 2:** 마크다운 `content` 렌더 (의존성 추가 여부는 구현 시 결정)
- [ ] **Step 3:** 테스트 — 존재하는 slug 200 / 없는 slug 404
- [ ] **Step 4:** 커밋

---

## Task 7: 소개 (`/about`)

**Files:** Create `pages/about.vue`

- [ ] **Step 1:** `handleSelectAbout()`로 프로필·경력·스킬 SSR 로딩
- [ ] **Step 2:** 커밋

---

## Task 8: SEO

**Files:** Modify `nuxt.config.ts`, 각 페이지

- [ ] **Step 1:** `useSeoMeta`로 title·description·og 설정
- [ ] **Step 2:** `robots.txt` · `sitemap.xml` 생성
- [ ] **Step 3:** 커밋

---

## Task 9: 스모크 페이지 정리 및 마감

- [ ] **Step 1:** `/smoke/**`를 프로덕션 빌드에서 제외할지 결정 (스펙 §5 정리 대상)
- [ ] **Step 2:** `npm test` 전체 통과 확인
- [ ] **Step 3:** Lighthouse 측정 (접근성 100 목표)
- [ ] **Step 4:** 커밋 및 main 병합

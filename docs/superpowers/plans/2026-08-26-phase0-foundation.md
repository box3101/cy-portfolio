# Phase 0 — 기반 구축 & 리스크 제거 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nuxt3 + `@leechanyong/ispark-ui` + Supabase 기반을 세우고, 후속 Phase의 설계를 무효화할 수 있는 리스크(SSR 미검증, 개인정보 노출)를 먼저 제거한다.

**Architecture:** Nuxt 3 SSR 앱을 스캐폴딩하고 `ispark-ui`를 `transpile` 대상으로 등록한다. 33개 컴포넌트를 카테고리별 스모크 페이지에 렌더한 뒤, Vitest + `@nuxt/test-utils`로 (1) 서버 HTML에 실제 마크업이 포함되는지 (2) 브라우저 콘솔에 hydration 오류가 없는지를 검증한다. 병행하여 Supabase 스키마·RLS·seed를 SQL 마이그레이션으로 확정한다.

**Tech Stack:** Nuxt 3 · Vue 3 · TypeScript · `@leechanyong/ispark-ui` (radix-vue) · Vitest · `@nuxt/test-utils` · Playwright · Supabase (Postgres/Auth/Storage) · Vercel

**Spec:** `docs/superpowers/specs/2026-08-26-portfolio-design.md`

---

## File Structure

| 파일 | 책임 |
|------|------|
| `package.json` | 의존성·스크립트 |
| `nuxt.config.ts` | 모듈, `transpile`, `routeRules`, runtimeConfig |
| `app.vue` | 루트 레이아웃, 글로벌 스타일 1회 import |
| `assets/css/tokens.css` | 브랜드 토큰 오버라이드 (ispark-ui 변수 위에 얹음) |
| `pages/smoke/index.vue` | 스모크 페이지 인덱스 |
| `pages/smoke/form.vue` | Form 그룹 스모크 |
| `pages/smoke/display.vue` | Display 그룹 스모크 |
| `pages/smoke/overlay.vue` | Overlay 그룹 스모크 |
| `pages/smoke/feedback.vue` | Feedback 그룹 스모크 |
| `pages/smoke/data.vue` | Data 그룹 스모크 |
| `test/ssr-smoke.test.ts` | 서버 렌더 검증 |
| `test/hydration.test.ts` | 브라우저 콘솔 오류 검증 |
| `supabase/migrations/0001_init.sql` | 테이블 + 인덱스 |
| `supabase/migrations/0002_rls.sql` | RLS 정책 |
| `supabase/seed.sql` | 초기 데이터 |
| `types/database.ts` | Supabase 생성 타입 |
| `.env.example` | 환경변수 템플릿 |

**스모크 페이지를 카테고리별로 쪼개는 이유:** 33개를 한 페이지에 넣으면 하나가 터졌을 때 어느 컴포넌트인지 특정이 안 된다. 그룹 단위로 나누면 실패 지점이 좁혀지고, 그룹별로 독립 커밋이 가능하다.

---

## Task 1: Nuxt3 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `tsconfig.json`, `app.vue`, `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Nuxt 프로젝트 생성**

```bash
cd C:/Users/pc/Documents/cy-portfolio
npm init -y
npm install nuxt@^3.21.11 vue@^3.5.40 vue-router@^5.2.0
npm install -D typescript@^5.6.0
```

- [ ] **Step 2: `package.json` 스크립트 작성**

`package.json`의 `"scripts"` 블록을 아래로 교체한다.

```json
{
  "name": "cy-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: `nuxt.config.ts` 작성**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-08-26',
  devtools: { enabled: true },

  // ispark-ui는 Vue SFC를 포함한 ESM 라이브러리 → 트랜스파일 필요
  build: {
    transpile: ['@leechanyong/ispark-ui'],
  },

  css: ['~/assets/css/tokens.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  routeRules: {
    '/': { isr: 3600 },
    '/projects': { isr: 3600 },
    '/projects/**': { isr: 3600 },
    '/archive': { isr: 3600 },
    '/about': { isr: 3600 },
    '/design-system': { ssr: true },
    '/admin/**': { ssr: false },
    // 스모크 페이지는 SSR 검증 대상이므로 캐시하지 않는다
    '/smoke/**': { ssr: true },
  },
})
```

- [ ] **Step 4: `app.vue` 작성**

```vue
<!-- app.vue -->
<template>
  <NuxtPage />
</template>
```

- [ ] **Step 5: `.env.example` 작성**

```bash
# Supabase
NUXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

- [ ] **Step 6: `.gitignore` 확인**

이미 `node_modules`, `.nuxt`, `.output`, `dist`, `.env`, `.vercel`이 포함되어 있어야 한다. 없으면 추가한다.

```bash
cat .gitignore
```

기대 출력: `node_modules` / `.nuxt` / `.output` / `dist` / `.env` / `.env.*` / `!.env.example` / `.vercel` / `.DS_Store`

- [ ] **Step 7: 개발 서버 기동 확인**

```bash
npm run dev
```

기대: `http://localhost:3000` 기동. 브라우저에서 404 페이지가 뜨면 정상(아직 `pages/`가 없음). `Ctrl+C`로 종료.

- [ ] **Step 8: 커밋**

```bash
git add package.json package-lock.json nuxt.config.ts tsconfig.json app.vue .env.example .gitignore
git commit -m "feat: Nuxt3 프로젝트 스캐폴딩"
```

---

## Task 2: ispark-ui 설치 및 최소 렌더 확인

**Files:**
- Modify: `package.json`
- Create: `assets/css/tokens.css`, `pages/smoke/index.vue`

- [ ] **Step 1: ispark-ui + peer dependency 설치**

`ispark-ui`는 peer dependency를 자동 설치하지 않는다. 4개를 명시적으로 설치한다.

```bash
npm install @leechanyong/ispark-ui@^0.5.16
npm install radix-vue@^1.9.17 @lucide/vue@^1.34.0 @internationalized/date@^3.12.3
```

- [ ] **Step 2: 설치 확인**

```bash
node -e "console.log(Object.keys(require('./node_modules/@leechanyong/ispark-ui/package.json').exports))"
```

기대 출력: `[ '.', './styles', './style.css', './dist/ispark-ui.css' ]`

- [ ] **Step 3: 글로벌 스타일 import 추가**

`app.vue`를 아래로 교체한다. 스타일은 앱 진입점에서 **1회만** import한다.

```vue
<!-- app.vue -->
<script setup lang="ts">
import '@leechanyong/ispark-ui/style.css'
</script>

<template>
  <NuxtPage />
</template>
```

- [ ] **Step 4: 브랜드 토큰 오버라이드 파일 작성**

ispark-ui의 CSS 변수 위에 포트폴리오 브랜드 색만 덮어쓴다. 라이트/다크 두 테마를 모두 정의한다.

```css
/* assets/css/tokens.css */

/* ===== 라이트 (기본) ===== */
:root {
  --brand-ground: #f6f3f8;
  --brand-surface: #ffffff;
  --brand-line: #e2d9ea;
  --brand-ink: #16111c;
  --brand-ink-muted: #7c7288;
  --brand-accent: #b4148f;
  --brand-focus: #0e7c86;
}

/* ===== 다크 (시스템 설정) ===== */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --brand-ground: #14101a;
    --brand-surface: #1c1724;
    --brand-line: #342b40;
    --brand-ink: #f1ecf6;
    --brand-ink-muted: #857a94;
    --brand-accent: #ec5cc0;
    --brand-focus: #5fe0e8;
  }
}

/* ===== 다크 (명시적 선택) ===== */
:root[data-theme='dark'] {
  --brand-ground: #14101a;
  --brand-surface: #1c1724;
  --brand-line: #342b40;
  --brand-ink: #f1ecf6;
  --brand-ink-muted: #857a94;
  --brand-accent: #ec5cc0;
  --brand-focus: #5fe0e8;
}

body {
  background: var(--brand-ground);
  color: var(--brand-ink);
}

:focus-visible {
  outline: 2px solid var(--brand-focus);
  outline-offset: 2px;
}
```

- [ ] **Step 4-1: ispark-ui 변수명 확인 후 브릿지 규칙 추가**

브라우저에서 스모크 페이지를 열고 개발자도구 콘솔에서 실행한다.

```js
[...document.styleSheets]
  .flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
  .filter(r => r.selectorText === ':root')
  .flatMap(r => [...r.style])
  .filter(n => n.startsWith('--'))
  .sort()
```

기대: `--color-primary`, `--color-text`, `--color-border` 등 ispark-ui 변수 목록 출력.

출력된 이름을 아래 형식으로 `assets/css/tokens.css` 하단에 추가한다.
(변수명이 다르면 위 출력값으로 좌변을 교체한다.)

```css
/* ===== ispark-ui 변수에 브랜드 색 주입 ===== */
:root {
  --color-primary: var(--brand-accent);
  --color-text: var(--brand-ink);
  --color-border: var(--brand-line);
  --color-surface: var(--brand-surface);
}
```

확인: 스모크 페이지의 `UiButton` primary 색이 `--brand-accent` 값으로 바뀌면 성공이다.
이 브릿지가 동작해야 `/design-system`의 실시간 테마 교체 데모가 성립한다.

- [ ] **Step 5: 스모크 인덱스 페이지 작성**

```vue
<!-- pages/smoke/index.vue -->
<script setup lang="ts">
// ===== 스모크 대상 그룹 =====
// 합계 34 = 고유 컴포넌트 33개 + UiProgress 중복 1회(Display/Feedback 양쪽에서 검증)
const groups = [
  { path: '/smoke/form', label: 'Form', count: 6 },
  { path: '/smoke/display', label: 'Display', count: 9 },
  { path: '/smoke/overlay', label: 'Overlay', count: 4 },
  { path: '/smoke/feedback', label: 'Feedback', count: 5 },
  { path: '/smoke/data', label: 'Data', count: 10 },
]
</script>

<template>
  <main data-smoke="index" style="padding: 32px; font-family: system-ui">
    <h1>ispark-ui SSR 스모크</h1>
    <ul>
      <li v-for="g in groups" :key="g.path">
        <NuxtLink :to="g.path">{{ g.label }} ({{ g.count }})</NuxtLink>
      </li>
    </ul>
  </main>
</template>
```

- [ ] **Step 6: 서버 렌더 확인**

```bash
npm run dev
```

다른 터미널에서:

```bash
curl -s http://localhost:3000/smoke | grep -c 'data-smoke="index"'
```

기대 출력: `1` (서버가 HTML을 렌더했다는 뜻)

- [ ] **Step 7: 커밋**

```bash
git add package.json package-lock.json app.vue assets/css/tokens.css pages/smoke/index.vue
git commit -m "feat: ispark-ui 설치 및 브랜드 토큰 정의"
```

---

## Task 3: 테스트 하네스 + Form 그룹 스모크

Form 그룹부터 시작하는 이유: README에 사용법이 명시된 `UiButton`을 포함하고 있어 API 확신도가 가장 높다.

**Files:**
- Create: `vitest.config.ts`, `test/ssr-smoke.test.ts`, `pages/smoke/form.vue`
- Modify: `package.json`

- [ ] **Step 1: 테스트 의존성 설치**

```bash
npm install -D vitest@^2.1.0 @nuxt/test-utils@^3.15.0 happy-dom@^15.0.0 playwright-core@^1.48.0
```

- [ ] **Step 2: `vitest.config.ts` 작성**

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'node',
    testTimeout: 120_000,   // Nuxt 빌드 포함이라 넉넉히 준다
    hookTimeout: 120_000,
  },
})
```

- [ ] **Step 3: 실패하는 테스트 작성**

`pages/smoke/form.vue`가 아직 없으므로 이 테스트는 실패해야 한다.

```ts
// test/ssr-smoke.test.ts
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ispark-ui SSR 스모크', async () => {
  await setup({ server: true, browser: false })

  it('Form 그룹이 서버에서 렌더링된다', async () => {
    const html = await $fetch<string>('/smoke/form')

    // 페이지 자체가 렌더됐는지
    expect(html).toContain('data-smoke="form"')

    // 각 컴포넌트가 서버 HTML에 실제 텍스트를 남겼는지
    // (SSR 실패 시 빈 껍데기만 남으므로 이 문자열들이 사라진다)
    expect(html).toContain('저장하기')      // UiButton 슬롯
    expect(html).toContain('이메일 주소')    // UiInput label
    expect(html).toContain('자기소개')       // UiTextarea label
    expect(html).toContain('공개 여부')      // UiToggle label
    expect(html).toContain('약관 동의')      // UiCheckbox label
    expect(html).toContain('연락 방법')      // UiRadio label
  })
})
```

- [ ] **Step 4: 테스트 실행 → 실패 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: FAIL. `/smoke/form`이 404이므로 `data-smoke="form"`을 찾지 못한다.

- [ ] **Step 5: Form 스모크 페이지 작성**

각 컴포넌트를 `<section>`으로 감싸고 `data-c` 속성을 붙인다. 실패 시 어느 컴포넌트인지 HTML에서 바로 특정하기 위함이다.

```vue
<!-- pages/smoke/form.vue -->
<script setup lang="ts">
import {
  UiButton,
  UiInput,
  UiTextarea,
  UiToggle,
  UiCheckbox,
  UiRadio,
} from '@leechanyong/ispark-ui'

// ===== 상태 =====
const email = ref('')
const bio = ref('')
const isPublic = ref(true)
const agreed = ref(false)
const contactWay = ref('email')
</script>

<template>
  <main data-smoke="form" style="padding: 32px; display: grid; gap: 24px">
    <h1>Form 그룹</h1>

    <section data-c="UiButton">
      <UiButton variant="primary" size="md">저장하기</UiButton>
      <UiButton variant="secondary" size="md">취소</UiButton>
      <UiButton variant="ghost" size="sm">더보기</UiButton>
      <UiButton variant="danger" size="lg">삭제</UiButton>
    </section>

    <section data-c="UiInput">
      <label for="smoke-email">이메일 주소</label>
      <UiInput id="smoke-email" v-model="email" placeholder="you@example.com" />
    </section>

    <section data-c="UiTextarea">
      <label for="smoke-bio">자기소개</label>
      <UiTextarea id="smoke-bio" v-model="bio" placeholder="소개를 입력하세요" />
    </section>

    <section data-c="UiToggle">
      <label for="smoke-public">공개 여부</label>
      <UiToggle id="smoke-public" v-model="isPublic" />
    </section>

    <section data-c="UiCheckbox">
      <UiCheckbox v-model="agreed">약관 동의</UiCheckbox>
    </section>

    <section data-c="UiRadio">
      <fieldset>
        <legend>연락 방법</legend>
        <UiRadio v-model="contactWay" value="email">이메일</UiRadio>
        <UiRadio v-model="contactWay" value="phone">전화</UiRadio>
      </fieldset>
    </section>
  </main>
</template>
```

- [ ] **Step 6: 테스트 실행 → 통과 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: PASS.

**실패한 경우 대응:**
- `v-model` 관련 오류 → Storybook의 해당 컴포넌트 Docs 탭에서 실제 model prop 이름 확인
  (예: https://box3101.github.io/ispark-ui/?path=/docs/components-form-uiinput--docs)
- `Cannot find module` → Task 2 Step 1의 peer dependency 설치 누락
- 슬롯 대신 prop을 요구하는 컴포넌트 → Storybook Default 스토리의 args를 그대로 옮긴다

수정 후 Step 6을 다시 실행한다.

- [ ] **Step 7: 커밋**

```bash
git add vitest.config.ts test/ssr-smoke.test.ts pages/smoke/form.vue package.json package-lock.json
git commit -m "test: Form 그룹 SSR 스모크 테스트 추가"
```

---

## Task 4: 나머지 그룹 스모크 (Display / Overlay / Feedback / Data)

Overlay·Feedback은 radix-vue Teleport와 imperative composable(`openToast`, `openConfirm`)을 쓰므로 **SSR 위험이 가장 높은 그룹**이다. 여기서 문제가 나오면 스펙 §5.3의 `<ClientOnly>` 처리 대상이 확정된다.

**Files:**
- Create: `pages/smoke/display.vue`, `pages/smoke/overlay.vue`, `pages/smoke/feedback.vue`, `pages/smoke/data.vue`
- Modify: `test/ssr-smoke.test.ts`

- [ ] **Step 1: Display 그룹 실패 테스트 추가**

`test/ssr-smoke.test.ts`의 `describe` 블록 안, 기존 `it` 뒤에 추가한다.

```ts
  it('Display 그룹이 서버에서 렌더링된다', async () => {
    const html = await $fetch<string>('/smoke/display')
    expect(html).toContain('data-smoke="display"')
    expect(html).toContain('진행중')        // UiBadge
    expect(html).toContain('이찬용')        // UiAvatar
    expect(html).toContain('프로젝트명')     // UiTable 헤더
    expect(html).toContain('경력 사항')      // UiAccordion 제목
    expect(html).toContain('60%')           // UiProgress
  })
```

- [ ] **Step 2: 실행 → 실패 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: Display 테스트만 FAIL, Form 테스트는 PASS 유지.

- [ ] **Step 3: Display 스모크 페이지 작성**

```vue
<!-- pages/smoke/display.vue -->
<script setup lang="ts">
import {
  UiBadge,
  UiBadgeGroup,
  UiAvatar,
  UiAvatarGroup,
  UiTable,
  UiAccordion,
  UiProgress,
  UiPagination,
  UiIcon,
} from '@leechanyong/ispark-ui'
import type { TableColumn, AccordionItemDef } from '@leechanyong/ispark-ui'

// ===== 테이블 =====
const columns: TableColumn[] = [
  { key: 'title', label: '프로젝트명' },
  { key: 'category', label: '구분' },
  { key: 'period', label: '기간' },
]
const rows = [
  { title: 'ispark-ui', category: 'Design System', period: '2025.04 —' },
  { title: 'TaskFlow', category: 'Full-stack', period: '2026.08 —' },
]

// ===== 아코디언 =====
const accordionItems: AccordionItemDef[] = [
  { value: 'career', title: '경력 사항', content: '이즈파크 AX Group (2025.03 — 현재)' },
  { value: 'edu', title: '학력', content: '동국대학교' },
]

// ===== 페이지네이션 =====
const page = ref(1)
</script>

<template>
  <main data-smoke="display" style="padding: 32px; display: grid; gap: 24px">
    <h1>Display 그룹</h1>

    <section data-c="UiBadge">
      <UiBadge variant="primary" size="md">진행중</UiBadge>
      <UiBadgeGroup>
        <UiBadge>Vue3</UiBadge>
        <UiBadge>Nuxt3</UiBadge>
      </UiBadgeGroup>
    </section>

    <section data-c="UiAvatar">
      <UiAvatar name="이찬용" shape="circle" />
      <UiAvatarGroup>
        <UiAvatar name="이찬용" />
        <UiAvatar name="김철수" />
      </UiAvatarGroup>
    </section>

    <section data-c="UiIcon">
      <UiIcon name="plus" />
    </section>

    <section data-c="UiTable">
      <UiTable :columns="columns" :rows="rows" />
    </section>

    <section data-c="UiAccordion">
      <UiAccordion :items="accordionItems" />
    </section>

    <section data-c="UiProgress">
      <UiProgress :value="60" variant="primary" size="md" />
      <span>60%</span>
    </section>

    <section data-c="UiPagination">
      <UiPagination v-model="page" :total="120" :per-page="10" />
    </section>
  </main>
</template>
```

- [ ] **Step 4: 실행 → 통과 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: PASS 2건.

`TableColumn` / `AccordionItemDef`의 실제 필드명이 다르면 타입 오류가 난다. Storybook Docs 탭에서 확인 후 수정한다:
- https://box3101.github.io/ispark-ui/?path=/docs/components-display-uitable--docs
- https://box3101.github.io/ispark-ui/?path=/docs/components-display-uiaccordion--docs

- [ ] **Step 5: 커밋**

```bash
git add pages/smoke/display.vue test/ssr-smoke.test.ts
git commit -m "test: Display 그룹 SSR 스모크 추가"
```

- [ ] **Step 6: Overlay 그룹 실패 테스트 추가**

```ts
  it('Overlay 그룹이 서버에서 렌더링된다', async () => {
    const html = await $fetch<string>('/smoke/overlay')
    expect(html).toContain('data-smoke="overlay"')
    expect(html).toContain('모달 열기')      // UiModal 트리거
    expect(html).toContain('메뉴 열기')      // UiDropdownMenu 트리거
    expect(html).toContain('서랍 열기')      // UiDrawer 트리거
    expect(html).toContain('도움말')         // UiTooltip 트리거
  })
```

- [ ] **Step 7: 실행 → 실패 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: Overlay만 FAIL.

- [ ] **Step 8: Overlay 스모크 페이지 작성**

오버레이는 **닫힌 상태의 트리거만** 서버에서 렌더되면 된다. 열린 상태는 클라이언트 전용이므로 SSR 검증 대상이 아니다.

```vue
<!-- pages/smoke/overlay.vue -->
<script setup lang="ts">
import {
  UiModal,
  UiDropdownMenu,
  UiDrawer,
  UiTooltip,
  UiButton,
} from '@leechanyong/ispark-ui'
import type { DropdownMenuItemDef } from '@leechanyong/ispark-ui'

// ===== 상태 =====
const isModalOpen = ref(false)
const isDrawerOpen = ref(false)

const menuItems: DropdownMenuItemDef[] = [
  { label: '수정', value: 'edit' },
  { label: '삭제', value: 'delete' },
]
</script>

<template>
  <main data-smoke="overlay" style="padding: 32px; display: grid; gap: 24px">
    <h1>Overlay 그룹</h1>

    <section data-c="UiModal">
      <UiButton @click="isModalOpen = true">모달 열기</UiButton>
      <UiModal v-model="isModalOpen" title="스모크 모달">
        <p>모달 본문</p>
      </UiModal>
    </section>

    <section data-c="UiDropdownMenu">
      <UiDropdownMenu :items="menuItems">
        <UiButton>메뉴 열기</UiButton>
      </UiDropdownMenu>
    </section>

    <section data-c="UiDrawer">
      <UiButton @click="isDrawerOpen = true">서랍 열기</UiButton>
      <UiDrawer v-model="isDrawerOpen" title="스모크 서랍">
        <p>서랍 본문</p>
      </UiDrawer>
    </section>

    <section data-c="UiTooltip">
      <UiTooltip content="이것은 툴팁입니다">
        <UiButton>도움말</UiButton>
      </UiTooltip>
    </section>
  </main>
</template>
```

- [ ] **Step 9: 실행 → 통과 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: PASS 3건.

**Teleport 관련 오류가 나면** (`Cannot read properties of null`, `document is not defined` 등) 해당 컴포넌트를 `<ClientOnly>`로 감싼다:

```vue
<ClientOnly>
  <UiModal v-model="isModalOpen" title="스모크 모달">
    <p>모달 본문</p>
  </UiModal>
</ClientOnly>
```

**이때 어떤 컴포넌트를 감쌌는지 반드시 기록한다.** 스펙 §5.3의 미검증 항목이 여기서 확정된다.

- [ ] **Step 10: 커밋**

```bash
git add pages/smoke/overlay.vue test/ssr-smoke.test.ts
git commit -m "test: Overlay 그룹 SSR 스모크 추가"
```

- [ ] **Step 11: Feedback 그룹 실패 테스트 추가**

```ts
  it('Feedback 그룹이 서버에서 렌더링된다', async () => {
    const html = await $fetch<string>('/smoke/feedback')
    expect(html).toContain('data-smoke="feedback"')
    expect(html).toContain('등록된 프로젝트가 없습니다')  // UiEmpty
    expect(html).toContain('토스트 띄우기')               // openToast 트리거
    expect(html).toContain('삭제 확인')                   // openConfirm 트리거
  })
```

- [ ] **Step 12: 실행 → 실패 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: Feedback만 FAIL.

- [ ] **Step 13: Feedback 스모크 페이지 작성**

`openToast` / `openConfirm`은 명령형 API다. **호출은 반드시 이벤트 핸들러 안에서만** 한다. setup 최상단에서 호출하면 서버에서 DOM에 접근하려다 터진다.

```vue
<!-- pages/smoke/feedback.vue -->
<script setup lang="ts">
import {
  UiEmpty,
  UiLoading,
  UiProgress,
  UiToast,
  UiConfirm,
  UiButton,
  openToast,
  openConfirm,
} from '@leechanyong/ispark-ui'

// ===== 이벤트 핸들러 =====
// 명령형 API는 클라이언트에서만 실행된다
const onToastClick = () => {
  openToast({ type: 'success', message: '저장되었습니다' })
}

const onConfirmClick = async () => {
  const ok = await openConfirm({ title: '삭제', message: '정말 삭제할까요?' })
  console.log('confirm 결과:', ok)
}
</script>

<template>
  <main data-smoke="feedback" style="padding: 32px; display: grid; gap: 24px">
    <h1>Feedback 그룹</h1>

    <section data-c="UiEmpty">
      <UiEmpty message="등록된 프로젝트가 없습니다" />
    </section>

    <section data-c="UiLoading">
      <UiLoading />
    </section>

    <section data-c="UiProgress">
      <UiProgress :value="30" />
    </section>

    <section data-c="UiToast">
      <UiButton @click="onToastClick">토스트 띄우기</UiButton>
      <ClientOnly><UiToast /></ClientOnly>
    </section>

    <section data-c="UiConfirm">
      <UiButton @click="onConfirmClick">삭제 확인</UiButton>
      <ClientOnly><UiConfirm /></ClientOnly>
    </section>
  </main>
</template>
```

- [ ] **Step 14: 실행 → 통과 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: PASS 4건.

- [ ] **Step 15: 커밋**

```bash
git add pages/smoke/feedback.vue test/ssr-smoke.test.ts
git commit -m "test: Feedback 그룹 SSR 스모크 추가"
```

- [ ] **Step 16: Data 그룹 실패 테스트 추가**

`UiChart`(Chart.js)와 `UiMarkdownEditor`(TipTap)는 canvas/DOM 의존이라 **서버 렌더를 기대하지 않는다.** 트리거·라벨만 검증한다.

```ts
  it('Data 그룹이 서버에서 렌더링된다', async () => {
    const html = await $fetch<string>('/smoke/data')
    expect(html).toContain('data-smoke="data"')
    expect(html).toContain('첨부 파일')      // UiFileList 라벨
    expect(html).toContain('파일 업로드')    // UiFileUpload 라벨
    expect(html).toContain('방문 통계')      // UiChart 컨테이너 라벨
    expect(html).toContain('상세 내용')      // UiMarkdownEditor 라벨
  })
```

- [ ] **Step 17: 실행 → 실패 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: Data만 FAIL.

- [ ] **Step 18: Data 스모크 페이지 작성**

```vue
<!-- pages/smoke/data.vue -->
<script setup lang="ts">
import {
  UiFileList,
  UiFileUpload,
  UiChart,
  UiMarkdownEditor,
  UiDatePicker,
  UiDateRangePicker,
  UiSelect,
  UiMultiSelect,
  UiTab,
  UiCalendarMonth,
} from '@leechanyong/ispark-ui'
import type {
  FileItem,
  SelectOption,
  MultiSelectOption,
  TabItem,
} from '@leechanyong/ispark-ui'

// ===== 파일 =====
const files: FileItem[] = [
  { name: '웹접근성인증서.pdf', size: 248_000 },
]

// ===== 셀렉트 =====
const category = ref('vue-nuxt')
const categoryOptions: SelectOption[] = [
  { label: 'Vue · Nuxt', value: 'vue-nuxt' },
  { label: 'Astro', value: 'astro' },
]

const tags = ref<string[]>([])
const tagOptions: MultiSelectOption[] = [
  { label: 'Vue3', value: 'vue3' },
  { label: 'Nuxt3', value: 'nuxt3' },
]

// ===== 날짜 =====
const startedOn = ref('')
const range = ref({ start: '', end: '' })

// ===== 탭 =====
const activeTab = ref('all')
const tabItems: TabItem[] = [
  { label: '전체', value: 'all' },
  { label: '진행중', value: 'ongoing' },
]

// ===== 마크다운 =====
const content = ref('')
</script>

<template>
  <main data-smoke="data" style="padding: 32px; display: grid; gap: 24px">
    <h1>Data 그룹</h1>

    <section data-c="UiFileList">
      <h2>첨부 파일</h2>
      <UiFileList :files="files" />
    </section>

    <section data-c="UiFileUpload">
      <h2>파일 업로드</h2>
      <UiFileUpload accept=".pdf" />
    </section>

    <section data-c="UiSelect">
      <UiSelect v-model="category" :options="categoryOptions" />
    </section>

    <section data-c="UiMultiSelect">
      <UiMultiSelect v-model="tags" :options="tagOptions" />
    </section>

    <section data-c="UiDatePicker">
      <UiDatePicker v-model="startedOn" />
    </section>

    <section data-c="UiDateRangePicker">
      <UiDateRangePicker v-model="range" />
    </section>

    <section data-c="UiTab">
      <UiTab v-model="activeTab" :items="tabItems" />
    </section>

    <section data-c="UiCalendarMonth">
      <UiCalendarMonth :events="[]" />
    </section>

    <section data-c="UiChart">
      <h2>방문 통계</h2>
      <ClientOnly>
        <UiChart
          type="bar"
          :data="{ labels: ['월', '화'], datasets: [{ label: '방문', data: [12, 19] }] }"
        />
        <template #fallback><div>차트 로딩 중…</div></template>
      </ClientOnly>
    </section>

    <section data-c="UiMarkdownEditor">
      <h2>상세 내용</h2>
      <ClientOnly>
        <UiMarkdownEditor v-model="content" />
        <template #fallback><div>에디터 로딩 중…</div></template>
      </ClientOnly>
    </section>
  </main>
</template>
```

- [ ] **Step 19: 실행 → 통과 확인**

```bash
npm test -- test/ssr-smoke.test.ts
```

기대: PASS 5건.

- [ ] **Step 20: 커밋**

```bash
git add pages/smoke/data.vue test/ssr-smoke.test.ts
git commit -m "test: Data 그룹 SSR 스모크 추가"
```

---

## Task 5: 하이드레이션 검증

서버 렌더가 되는 것과 hydration이 깨지지 않는 것은 별개다. 브라우저에서 콘솔 오류 0건을 확인한다.

**Files:**
- Create: `test/hydration.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Playwright 브라우저 설치**

```bash
npx playwright install chromium
```

- [ ] **Step 2: 실패하는 테스트 작성**

```ts
// test/hydration.test.ts
import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

const SMOKE_PATHS = [
  '/smoke/form',
  '/smoke/display',
  '/smoke/overlay',
  '/smoke/feedback',
  '/smoke/data',
]

describe('ispark-ui 하이드레이션', async () => {
  await setup({ server: true, browser: true })

  for (const path of SMOKE_PATHS) {
    it(`${path} 에서 콘솔 오류가 없다`, async () => {
      const errors: string[] = []

      const page = await createPage()
      page.on('console', (msg) => {
        const text = msg.text()
        // hydration mismatch는 warning으로 나오므로 함께 수집한다
        if (msg.type() === 'error' || text.includes('Hydration')) {
          errors.push(`[${msg.type()}] ${text}`)
        }
      })
      page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

      await page.goto(`${process.env.NUXT_TEST_URL ?? 'http://localhost:3000'}${path}`)
      await page.waitForLoadState('networkidle')

      expect(errors, errors.join('\n')).toEqual([])
      await page.close()
    })
  }
})
```

- [ ] **Step 3: 실행**

```bash
npm test -- test/hydration.test.ts
```

기대: 5건 중 일부 FAIL 가능. **실패는 정상이며, 이 태스크의 목적이 바로 그 목록을 얻는 것이다.**

- [ ] **Step 4: 실패 항목 분류 및 조치**

각 실패를 아래 기준으로 처리한다.

| 오류 메시지 | 원인 | 조치 |
|------------|------|------|
| `Hydration node mismatch` / `Hydration text mismatch` | 서버·클라이언트 렌더 결과 불일치 | 해당 컴포넌트를 `<ClientOnly>`로 감싼다 |
| `document is not defined` / `window is not defined` | SSR 중 DOM 접근 | `<ClientOnly>` 또는 `onMounted` 내부로 이동 |
| `Failed to resolve component` | export 이름 오타 | `src/index.ts`의 export명과 대조 |
| 404 (폰트·이미지) | 에셋 누락 | 스모크 페이지에서는 무시 가능. 목록에만 기록 |

조치 후 Step 3을 재실행하여 전부 PASS가 될 때까지 반복한다.

- [ ] **Step 5: 검증 결과 문서화**

`docs/superpowers/notes/2026-08-26-ssr-verification.md`를 생성하고 아래 형식으로 기록한다.

```markdown
# ispark-ui SSR 검증 결과 (2026-08-26)

## 환경
- Nuxt: 3.21.x
- @leechanyong/ispark-ui: 0.5.16

## SSR 정상 (별도 처리 불필요)
- UiButton, UiInput, ... (실제 확인된 목록으로 채운다)

## `<ClientOnly>` 필요
| 컴포넌트 | 사유 | 오류 메시지 |
|---------|------|------------|
| UiChart | Chart.js canvas 의존 | (실제 메시지) |

## ispark-ui 수정 권고
| 컴포넌트 | 문제 | 제안 |
|---------|------|------|
```

> 이 문서는 Phase 1~3의 `<ClientOnly>` 적용 근거가 된다.
> "SSR 대응을 위해 라이브러리를 개선했다"는 포트폴리오 서사의 원자료이기도 하다.

- [ ] **Step 6: 커밋**

```bash
git add test/hydration.test.ts docs/superpowers/notes/2026-08-26-ssr-verification.md pages/smoke/
git commit -m "test: 하이드레이션 검증 및 SSR 대응 목록 확정"
```

---

## Task 6: Supabase 스키마 마이그레이션

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `supabase/migrations/0002_rls.sql`

- [ ] **Step 1: Supabase 프로젝트 생성**

https://supabase.com/dashboard 에서 새 프로젝트를 만든다.
- Region: `Northeast Asia (Seoul)`
- 생성 후 Settings → API에서 `Project URL`과 `anon public` 키를 복사한다.

`.env` 파일을 만들고 값을 넣는다 (`.env`는 커밋되지 않는다).

```bash
NUXT_PUBLIC_SUPABASE_URL=<복사한 Project URL>
NUXT_PUBLIC_SUPABASE_ANON_KEY=<복사한 anon key>
```

- [ ] **Step 2: 테이블 마이그레이션 작성**

```sql
-- supabase/migrations/0001_init.sql

-- ===== 프로젝트 =====
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  subtitle      text,
  summary       text,
  category      text not null check (category in ('vue-nuxt','astro','react','publisher')),
  period_start  date not null,
  period_end    date,                       -- null = 진행중
  content       text,                       -- 마크다운 상세
  thumbnail_path text,
  repo_url      text,
  live_url      text,
  tags          text[] not null default '{}',
  role          text,
  sort_order    int  not null default 0,
  is_featured   boolean not null default false,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index projects_tags_idx        on public.projects using gin (tags);
create index projects_published_idx   on public.projects (is_published, sort_order);
create index projects_category_idx    on public.projects (category);

-- ===== 아카이브 (인증서·자료) =====
create table public.archives (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  doc_type       text not null check (doc_type in ('증명서','포트폴리오','기타')),
  issuer         text,
  issued_on      date,
  file_path      text not null,
  thumbnail_path text,
  description    text,
  sort_order     int not null default 0,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now()
);

create index archives_published_idx on public.archives (is_published, sort_order);

-- ===== 경력 =====
create table public.careers (
  id           uuid primary key default gen_random_uuid(),
  company      text not null,
  position     text not null,
  period_start date not null,
  period_end   date,
  description  text,
  sort_order   int not null default 0
);

-- ===== 스킬 =====
create table public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null check (category in ('language','framework','tool','design')),
  level      int  not null check (level between 1 and 5),
  sort_order int  not null default 0
);

-- ===== 프로필 (단일 row) =====
create table public.profile (
  id          int primary key default 1 check (id = 1),
  name        text not null,
  headline    text,
  bio         text,
  email       text,
  github_url  text,
  blog_url    text,
  resume_path text,
  avatar_path text,
  updated_at  timestamptz not null default now()
);

-- ===== 방문 로그 =====
create table public.page_views (
  id         bigserial primary key,
  path       text not null,
  referrer   text,
  created_at timestamptz not null default now()
);

create index page_views_created_idx on public.page_views (created_at desc);

-- ===== updated_at 자동 갱신 =====
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
```

- [ ] **Step 3: RLS 정책 작성**

```sql
-- supabase/migrations/0002_rls.sql

alter table public.projects   enable row level security;
alter table public.archives   enable row level security;
alter table public.careers    enable row level security;
alter table public.skills     enable row level security;
alter table public.profile    enable row level security;
alter table public.page_views enable row level security;

-- ===== 공개 읽기: is_published = true 인 행만 =====
create policy "공개 프로젝트 읽기" on public.projects
  for select to anon using (is_published = true);

create policy "공개 아카이브 읽기" on public.archives
  for select to anon using (is_published = true);

-- 경력·스킬·프로필은 공개 여부 컬럼이 없으므로 전체 읽기 허용
create policy "경력 읽기" on public.careers for select to anon using (true);
create policy "스킬 읽기" on public.skills  for select to anon using (true);
create policy "프로필 읽기" on public.profile for select to anon using (true);

-- ===== 방문 로그: 익명 쓰기만 허용, 읽기는 관리자만 =====
create policy "방문 로그 기록" on public.page_views
  for insert to anon with check (true);

create policy "방문 로그 조회" on public.page_views
  for select to authenticated using (true);

-- ===== 관리자: 전체 권한 =====
create policy "관리자 프로젝트" on public.projects  for all to authenticated using (true) with check (true);
create policy "관리자 아카이브" on public.archives  for all to authenticated using (true) with check (true);
create policy "관리자 경력"     on public.careers   for all to authenticated using (true) with check (true);
create policy "관리자 스킬"     on public.skills    for all to authenticated using (true) with check (true);
create policy "관리자 프로필"   on public.profile   for all to authenticated using (true) with check (true);
```

- [ ] **Step 4: 마이그레이션 적용**

Supabase 대시보드 → SQL Editor에서 `0001_init.sql` 전체를 붙여넣고 실행한다. 이어서 `0002_rls.sql`을 실행한다.

기대: 두 스크립트 모두 `Success. No rows returned`.

- [ ] **Step 5: RLS 동작 확인**

SQL Editor에서 실행한다.

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

기대 출력: `archives`, `careers`, `page_views`, `profile`, `projects`, `skills` 6개 행 모두 `rowsecurity = true`.

- [ ] **Step 6: Storage 버킷 생성**

대시보드 → Storage에서 버킷 3개를 만든다. 모두 **Public** 으로 설정한다.

| 버킷명 | 용도 |
|--------|------|
| `thumbnails` | 프로젝트 썸네일 |
| `documents` | 인증서 PDF |
| `profile` | 아바타·이력서 |

- [ ] **Step 7: 커밋**

```bash
git add supabase/migrations/
git commit -m "feat: Supabase 스키마 및 RLS 정책 정의"
```

---

## Task 7: seed 데이터 및 타입 생성

**Files:**
- Create: `supabase/seed.sql`, `types/database.ts`

- [ ] **Step 1: seed SQL 작성**

기존 `Portfolio.jsx` 17건 중 실무 프로젝트와 신규 3건을 넣는다.
게재 대상 최종 선별은 스펙 §13의 미결정 항목이므로, **일단 전부 `is_published = false`로 넣고** 어드민에서 켠다.

```sql
-- supabase/seed.sql

-- ===== 프로필 =====
insert into public.profile (id, name, headline, bio, email, github_url)
values (
  1,
  '이찬용',
  '디자인 시스템을 만들고, 그 시스템으로 제품을 만듭니다.',
  '공공기관 웹사이트부터 엔터프라이즈 솔루션까지 프론트엔드를 담당해왔습니다. 현재는 Vue3 기반 디자인 시스템 ispark-ui를 만들고 운영합니다.',
  'tony.at.cp@gmail.com',
  'https://github.com/box3101'
)
on conflict (id) do update set
  name = excluded.name,
  headline = excluded.headline,
  bio = excluded.bio;

-- ===== 프로젝트 =====
insert into public.projects
  (slug, title, subtitle, summary, category, period_start, period_end, tags, role, repo_url, live_url, sort_order, is_featured, is_published)
values
  ('ispark-ui', 'ispark-ui 디자인 시스템', 'Design System',
   'Vue3 · radix-vue 기반 디자인 시스템. 컴포넌트 33개, 스토리 280개 이상, npm 퍼블리시.',
   'vue-nuxt', '2025-04-28', null,
   array['Vue3','radix-vue','Storybook','TypeScript','npm'],
   '기획·설계·구현 전체',
   'https://github.com/box3101/ispark-ui',
   'https://box3101.github.io/ispark-ui/',
   10, true, false),

  ('taskflow', 'TaskFlow 프로젝트 관리 앱', 'Full-stack',
   'ispark-ui로 만든 풀스택 프로젝트 관리 앱. Vue3+TS 프론트, Express+Prisma+PostgreSQL 백엔드, JWT 인증.',
   'vue-nuxt', '2026-08-01', null,
   array['Vue3','TypeScript','Express','Prisma','PostgreSQL','JWT','ispark-ui'],
   '프론트엔드·백엔드·DB 설계 전체',
   'https://github.com/box3101/taskflow',
   'https://ispark-task.up.railway.app/',
   20, true, false),

  ('sgate-okr-solution', '이즈파크 AX Group 성과관리 솔루션', '성과관리 솔루션 개발',
   'Vue3·Nuxt3·Pinia 기반 성과관리 솔루션. 디자인 컴포넌트 시스템 구축 및 UI/UX 최적화.',
   'vue-nuxt', '2025-03-01', null,
   array['Vue3','Nuxt3','Pinia','디자인 시스템'],
   '프론트엔드 개발 · 디자인 시스템 구축',
   null, null,
   30, true, false),

  ('movie-dashboard', '박스오피스 대시보드', 'Data Dashboard',
   'Nuxt3 + Supabase + KOBIS 박스오피스 API 기반 대시보드.',
   'vue-nuxt', '2026-08-24', null,
   array['Nuxt3','Supabase','KOBIS API'],
   '개인 프로젝트',
   'https://github.com/box3101/movie-dashboard',
   'https://movie-dashboard-two-khaki.vercel.app',
   40, false, false),

  ('yeonsu-library-website', '연수구립도서관 공식 웹사이트', '도서관 공식 웹사이트',
   'Astro 4.15 기반 정적 사이트. SCSS 7-1 아키텍처 + BEM, 재사용 UI 컴포넌트 시스템 구축.',
   'astro', '2025-03-01', null,
   array['Astro','SCSS','Nanostores','Swiper.js'],
   '퍼블리싱 · 컴포넌트 설계',
   'https://github.com/box3101/yeonsu-library-web', null,
   50, false, false),

  ('korean-bank-evaluation', '한국은행 직원평가시스템', 'Employee Evaluation System',
   '기획-디자인-개발 올인원으로 빌드업한 직원평가 시스템. Astro 기반.',
   'astro', '2023-07-01', '2024-01-31',
   array['Astro','적응형','웹 접근성','인터랙션'],
   '기획 · 디자인 · 개발',
   null, null,
   60, false, false),

  ('incheon-jung-gu-edu', '인천광역시 중구청 평생교육포털', 'Lifelong Education Portal',
   'Front 및 관리자 화면 UI 개발. gulp 대신 Astro를 도입해 개발 효율 개선.',
   'astro', '2022-10-01', '2023-03-31',
   array['Astro','반응형','웹 접근성'],
   'Front · Admin UI 개발',
   null, 'https://edu.icjg.go.kr/',
   70, false, false),

  ('incheon-city', '인천광역시 웹사이트 · 패밀리 사이트', 'Public Sector Web Development',
   '3년간 유지보수 및 개선. 2021.03 웹 접근성 마크 획득, 2021.10 행정안전부 품질관리 우수평가, 2022.03 갱신.',
   'publisher', '2020-01-01', '2022-12-31',
   array['공공기관','웹 접근성','품질관리 우수평가','장기 프로젝트'],
   '퍼블리싱 · 유지보수',
   null, 'https://www.incheon.go.kr/index',
   80, false, false),

  ('samsung-sdi-gsop', '삼성 SDI GSOP 시스템', 'Enterprise System Development',
   'Global Standard Operation Procedure 시스템의 Admin 화면 개발 및 테마 커스터마이징.',
   'publisher', '2023-02-01', '2023-08-31',
   array['Admin 개발','시스템 커스터마이징','기업 솔루션'],
   'Admin 화면 개발',
   null, null,
   90, false, false),

  ('g4b-business-support', 'G4b 기업지원 플러스 리뉴얼', 'Business Support Platform',
   '기업지원 플러스 Front 화면 리뉴얼. 웹 접근성 마크 획득.',
   'publisher', '2022-04-01', '2022-07-31',
   array['반응형','인터랙티브','웹 접근성','리뉴얼'],
   'Front 개발',
   null, null,
   100, false, false),

  ('ict-ksa-system', 'ICT 한국표준협회 성과관리 시스템', 'Performance Management System',
   'ICT 산업 표준화를 위한 성과관리 시스템 Front 화면 개발.',
   'publisher', '2022-07-01', '2022-11-30',
   array['반응형','인터랙티브','성과관리 시스템'],
   'Front 개발',
   null, 'https://rnd.tta.or.kr/user/main/main/main',
   110, false, false),

  ('animal-flash-cards', '동물 플래시 카드', 'toy project',
   '아이를 위한 동물 플래시 카드 웹 앱. 다국어(한/영) 지원, 이미지 로딩 최적화.',
   'react', '2023-06-03', '2023-06-16',
   array['React','상태 관리','다국어','교육용 앱'],
   '개인 프로젝트',
   'https://github.com/box3101/AnimalCards/', null,
   120, false, false)
on conflict (slug) do nothing;

-- ===== 경력 =====
insert into public.careers (company, position, period_start, period_end, description, sort_order)
values
  ('이즈파크 AX Group', '프론트엔드 개발', '2025-03-01', null,
   'Sgate 성과관리 솔루션 개발. Vue3/Nuxt3 기반 디자인 컴포넌트 시스템 구축 및 UI/UX 최적화.', 10)
on conflict do nothing;

-- ===== 스킬 =====
insert into public.skills (name, category, level, sort_order) values
  ('JavaScript (ES6+)', 'language',  5, 10),
  ('TypeScript',        'language',  4, 20),
  ('Vue 3',             'framework', 5, 30),
  ('Nuxt 3',            'framework', 4, 40),
  ('Astro',             'framework', 4, 50),
  ('React',             'framework', 3, 60),
  ('SCSS',              'language',  5, 70),
  ('Storybook',         'tool',      4, 80),
  ('Supabase',          'tool',      3, 90),
  ('Figma',             'design',    4, 100)
on conflict do nothing;
```

> **아카이브(인증서) seed는 여기 없다.** PDF 마스킹 검수(Task 9)를 통과한 파일만 등록하기 위함이다.

- [ ] **Step 2: seed 적용**

Supabase 대시보드 → SQL Editor에 `supabase/seed.sql` 전체를 붙여넣고 실행한다.

- [ ] **Step 3: 적재 확인**

```sql
select
  (select count(*) from public.projects) as projects,
  (select count(*) from public.careers)  as careers,
  (select count(*) from public.skills)   as skills,
  (select count(*) from public.profile)  as profile;
```

기대 출력: `projects = 12`, `careers = 1`, `skills = 10`, `profile = 1`

- [ ] **Step 4: 공개 읽기가 차단되는지 확인 (RLS 검증)**

모든 프로젝트가 `is_published = false`이므로 anon 키로는 0건이 나와야 한다.

```bash
curl -s "$NUXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=slug" \
  -H "apikey: $NUXT_PUBLIC_SUPABASE_ANON_KEY"
```

기대 출력: `[]`

이 응답이 `[]`가 아니라 데이터가 나온다면 RLS가 적용되지 않은 것이므로 Task 6 Step 3~5를 다시 확인한다.

- [ ] **Step 5: 타입 생성**

```bash
npx supabase gen types typescript --project-id <프로젝트 ID> --schema public > types/database.ts
```

`<프로젝트 ID>`는 Supabase 대시보드 URL의 `/project/<여기>` 부분이다.

- [ ] **Step 6: 타입 생성 확인**

```bash
node -e "const s=require('fs').readFileSync('types/database.ts','utf8'); ['projects','archives','careers','skills','profile','page_views'].forEach(t=>console.log(t, s.includes(t)))"
```

기대 출력: 6줄 모두 `true`

- [ ] **Step 7: 커밋**

```bash
git add supabase/seed.sql types/database.ts
git commit -m "feat: 초기 seed 데이터 및 Supabase 타입 생성"
```

---

## Task 8: Vercel 연결

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: GitHub 레포 생성 및 푸시**

```bash
gh repo create cy-portfolio --private --source=. --remote=origin
git push -u origin main
```

- [ ] **Step 2: `vercel.json` 작성**

```json
{
  "framework": "nuxtjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "regions": ["icn1"]
}
```

- [ ] **Step 3: Vercel 프로젝트 연결**

https://vercel.com/new 에서 `cy-portfolio` 레포를 import한다.
Environment Variables에 아래 2개를 **Production / Preview / Development 모두**에 추가한다.

| Key | Value |
|-----|-------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

- [ ] **Step 4: 배포 확인**

배포 완료 후 스모크 페이지가 뜨는지 확인한다.

```bash
curl -s https://<배포된-도메인>/smoke | grep -c 'data-smoke="index"'
```

기대 출력: `1`

- [ ] **Step 5: 커밋**

```bash
git add vercel.json
git commit -m "chore: Vercel 배포 설정"
git push
```

---

## Task 9: 인증서 PDF 마스킹 검수 🚨

**수동 작업.** 스펙 §12의 최우선 리스크다. 이 태스크가 끝나기 전에는 `/archive`에 어떤 파일도 올리지 않는다.

**Files:**
- Create: `docs/superpowers/notes/2026-08-26-archive-audit.md`

- [ ] **Step 1: 검수 대상 목록 작성**

`C:\Users\pc\Documents` 및 이력서 첨부에서 아래 파일들을 한 폴더(`archive-raw/`)로 모은다. 이 폴더는 커밋하지 않는다.

| 파일 | 구분 |
|------|------|
| `[웹접근성인증]인천광역시_인증서.pdf` | 증명서 |
| `[웹품질인증]인천광역시_우수등급_인증서.pdf` | 증명서 |
| `2023_12_문화포털-심사결과서(2차).pdf` | 증명서 |
| `2023_04_인천중구_교육포털_배우는바다-심사결과서.pdf` | 증명서 |
| `2023_03_문화포털-심사결과서(2차).pdf` | 증명서 |
| `2022_04_IFEZ_인천경제자유구역-심사결과서.pdf` | 증명서 |
| `2022_03_인천광역시청-심사결과서(2차).pdf` | 증명서 |
| `2021_12_인천일자리포털-심사결과서(2차).pdf` | 증명서 |
| `2021_03_인천광역시청-심사결과서(2차).pdf` | 증명서 |
| `[졸업논문]프론트엔드-상태관리-라이브러리.pdf` | 기타 |
| `Cursor_AI_활용_심화_v1.3.pdf` | 기타 |
| `Cursor_AI_활용_초심자.pdf` | 기타 |

- [ ] **Step 2: 파일별 전수 검수**

각 PDF를 열고 아래 항목의 존재 여부를 확인한다.

| 확인 항목 | 조치 |
|----------|------|
| 발주처 담당자 실명·직급 | 마스킹 |
| 전화번호·이메일 | 마스킹 |
| 내부 시스템 URL·IP | 마스킹 |
| 미공개 일정·예산 정보 | 마스킹 또는 해당 페이지 제외 |
| 본인 주민번호·주소·서명 | 마스킹 |

- [ ] **Step 3: 검수 결과 기록**

`docs/superpowers/notes/2026-08-26-archive-audit.md`에 기록한다.

```markdown
# 아카이브 PDF 검수 결과 (2026-08-26)

| 파일 | 검수 | 발견 항목 | 조치 | 게시 가능 |
|------|------|----------|------|----------|
| [웹접근성인증]인천광역시_인증서.pdf | ✅ | 없음 | — | 예 |
```

- [ ] **Step 4: 게시 가능 파일만 Storage 업로드**

Supabase 대시보드 → Storage → `documents` 버킷에 **"게시 가능 = 예"인 파일만** 업로드한다.

- [ ] **Step 5: PDF 1페이지 썸네일 추출**

각 PDF의 1페이지를 PNG로 추출해 `thumbnails` 버킷에 `archive/<slug>.png`로 업로드한다.

```bash
# ImageMagick + Ghostscript가 설치된 경우
magick -density 150 "input.pdf[0]" -quality 85 -resize 800x output.png
```

설치가 없으면 PDF 뷰어에서 1페이지를 캡처해도 무방하다.

- [ ] **Step 6: archives 테이블에 등록**

게시 가능한 파일만 SQL Editor에서 등록한다. 아래는 1건 예시이며, 검수를 통과한 파일 수만큼 행을 추가한다.

```sql
insert into public.archives
  (title, doc_type, issuer, issued_on, file_path, thumbnail_path, description, sort_order, is_published)
values
  ('웹 접근성 인증 (인천광역시)', '증명서', '인천광역시', '2021-03-01',
   'documents/web-accessibility-incheon-2021.pdf',
   'thumbnails/archive/web-accessibility-incheon-2021.png',
   '인천광역시 웹사이트 웹 접근성 인증마크 획득', 10, true);
```

- [ ] **Step 7: 커밋**

```bash
git add docs/superpowers/notes/2026-08-26-archive-audit.md
git commit -m "docs: 아카이브 PDF 개인정보 검수 결과"
```

---

## Task 10: TaskFlow 데모 계정 분리 🚨

**다른 레포(`box3101/taskflow`) 작업.** 스펙 §12의 최우선 리스크다.

현재 로그인 폼 기본값으로 채워진 계정은 개인 실계정이며, 로그인 시 실제 진행 중인 회사 프로젝트명과 개인 항목이 노출된다. 이 태스크 완료 전에는 포트폴리오에서 TaskFlow에 `LIVE` 배지를 붙이거나 계정을 공개하지 않는다.

**Files:**
- Modify: `backend/src/seed.ts` (taskflow 레포)

- [ ] **Step 1: taskflow 레포 클론**

```bash
cd C:/Users/pc/Documents
gh repo clone box3101/taskflow
cd taskflow
```

- [ ] **Step 2: 현재 seed 구조 확인**

```bash
cat backend/src/seed.ts
```

기존 seed가 어떤 계정·데이터를 만드는지 파악한다. `npm run db:seed`가 이 파일을 실행한다.

- [ ] **Step 3: 데모 전용 시드 스크립트 작성**

`backend/src/seed-demo.ts`를 새로 만든다. **기존 `seed.ts`는 수정하지 않는다.**

```ts
// backend/src/seed-demo.ts
// 포트폴리오 공개용 데모 계정 및 샘플 데이터.
// 개인 실계정 데이터와 완전히 분리한다.
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@taskflow.dev'
const DEMO_PASSWORD = 'demo1234'

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  // ===== 데모 사용자 =====
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      password: passwordHash,
      name: '데모 사용자',
    },
  })

  // ===== 데모 프로젝트 =====
  // 실제 회사 프로젝트명을 쓰지 않는다.
  const demoProjects = [
    { name: '웹사이트 리뉴얼', description: '기업 홈페이지 전면 개편' },
    { name: '모바일 앱 v2.0', description: '사용자 피드백 반영 개선' },
    { name: '디자인 시스템 구축', description: '공용 컴포넌트 라이브러리' },
  ]

  for (const p of demoProjects) {
    await prisma.project.create({
      data: { ...p, ownerId: user.id },
    })
  }

  console.log(`데모 계정 생성 완료: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

> 위 코드의 `prisma.user` / `prisma.project` 필드명은 `backend/prisma/schema.prisma`의 실제 모델과 일치해야 한다.
> Step 2에서 확인한 기존 `seed.ts`의 필드명을 그대로 따른다.

- [ ] **Step 4: 스크립트 등록**

`backend/package.json`의 `scripts`에 추가한다.

```json
"db:seed:demo": "ts-node-dev --transpile-only src/seed-demo.ts"
```

- [ ] **Step 5: 로컬에서 실행**

```bash
cd backend
npm run db:seed:demo
```

기대 출력: `데모 계정 생성 완료: demo@taskflow.dev / demo1234`

- [ ] **Step 6: 로그인 화면 자동입력 값 변경**

로그인 폼에 **개인 실계정 자격증명이 기본값으로 채워져 있다.** 데모 계정으로 교체한다.

```bash
# 로그인 폼의 기본값이 하드코딩된 위치를 찾는다
grep -rn "@test.com" frontend/src
```

검색된 파일의 기본값을 `demo@taskflow.dev` / `demo1234`로 바꾼다.

- [ ] **Step 7: 배포 후 검증**

```bash
git add backend/src/seed-demo.ts backend/package.json frontend/src
git commit -m "feat: 포트폴리오 공개용 데모 계정 및 시드 분리"
git push
```

Railway 재배포 후 https://ispark-task.up.railway.app/ 에 `demo@taskflow.dev` / `demo1234`로 로그인한다.

**확인 항목:**
- [ ] 대시보드에 회사 프로젝트명(SGate 등)이 보이지 않는다
- [ ] 할일 목록에 개인 항목이 보이지 않는다
- [ ] 데모 프로젝트 3건이 보인다

세 항목이 모두 확인되면 포트폴리오에서 TaskFlow에 `LIVE` 배지를 붙일 수 있다.

- [ ] **Step 8: cy-portfolio에 데모 계정 정보 기록**

`cy-portfolio` 레포로 돌아와 seed를 갱신한다.

```sql
update public.projects
set summary = summary || ' 데모 계정: demo@taskflow.dev / demo1234'
where slug = 'taskflow';
```

---

## Task 11: ispark-ui README 갱신

현재 README는 "테스트 단계 (v0.1.x)", "npm registry 설치 (예정 — 미정)"으로 되어 있으나 실제로는 v0.5.16이 npm에 퍼블리시되어 있다. 면접관이 GitHub를 먼저 볼 경우 "미배포"로 오인한다.

**Files:**
- Modify: `README.md` (ispark-ui 레포)

- [ ] **Step 1: ispark-ui 레포 클론**

```bash
cd C:/Users/pc/Documents
gh repo clone box3101/ispark-ui
cd ispark-ui
```

- [ ] **Step 2: 상단 배지 및 설치 안내 교체**

`README.md`의 첫 부분을 아래로 교체한다.

```markdown
# @leechanyong/ispark-ui

Vue 3 + Vite + Storybook 기반 디자인 시스템 UI 라이브러리.

[![npm](https://img.shields.io/npm/v/@leechanyong/ispark-ui)](https://www.npmjs.com/package/@leechanyong/ispark-ui)
[![license](https://img.shields.io/npm/l/@leechanyong/ispark-ui)](./LICENSE)

📖 **[Storybook 문서 보기](https://box3101.github.io/ispark-ui/)**

컴포넌트 33개 · 스토리 280개 이상 · TypeScript 타입 제공

## 설치

```bash
npm install @leechanyong/ispark-ui
```

peer dependency를 함께 설치한다.

```bash
npm install vue radix-vue @lucide/vue @internationalized/date
```

### Nuxt 3에서 사용

`nuxt.config.ts`에 트랜스파일 설정을 추가한다.

```ts
export default defineNuxtConfig({
  build: { transpile: ['@leechanyong/ispark-ui'] },
})
```

`app.vue`에서 글로벌 스타일을 1회 import한다.

```vue
<script setup lang="ts">
import '@leechanyong/ispark-ui/style.css'
</script>
```
```

- [ ] **Step 3: 구버전 안내 제거**

아래 두 블록을 README에서 삭제한다.

- `> ⚠️ **테스트 단계 (v0.1.x)** — API가 자주 바뀔 수 있습니다...` 경고문
- `### npm registry 설치 (예정 — 미정)` 섹션 전체
- `### Git URL 직접 설치 (현재 권장 — 인증 불필요)` 섹션 (npm 배포 완료로 불필요)

- [ ] **Step 4: 렌더 확인**

```bash
grep -n "테스트 단계\|예정 — 미정\|v0.1" README.md
```

기대 출력: 없음 (검색 결과 0건)

- [ ] **Step 5: 커밋 및 푸시**

```bash
git add README.md
git commit -m "docs: npm 배포 상태 반영 및 Nuxt3 설치 안내 추가"
git push
```

---

## Task 12: Phase 0 완료 확인

- [ ] **Step 1: 전체 테스트 실행**

```bash
cd C:/Users/pc/Documents/cy-portfolio
npm test
```

기대: SSR 스모크 5건 + 하이드레이션 5건, 총 10건 PASS.

- [ ] **Step 2: 완료 체크리스트 확인**

| 항목 | 확인 |
|------|------|
| Nuxt3 + ispark-ui 로컬 기동 | `npm run dev` 정상 |
| 33개 컴포넌트 SSR 검증 완료 | `docs/superpowers/notes/2026-08-26-ssr-verification.md` 작성됨 |
| `<ClientOnly>` 대상 확정 | 위 문서에 목록 존재 |
| Supabase 스키마 + RLS 적용 | 테이블 6개, RLS 전부 활성 |
| seed 적재 | 프로젝트 12건, 스킬 10건 |
| RLS 차단 검증 | anon 조회 시 `[]` |
| Vercel 배포 | `/smoke` 접근 가능 |
| PDF 마스킹 검수 | `2026-08-26-archive-audit.md` 작성됨 |
| TaskFlow 데모 계정 | 실계정 데이터 미노출 확인 |
| ispark-ui README | 구버전 문구 제거 |

- [ ] **Step 3: Phase 1 착수 전 결정 사항 정리**

스펙 §13의 미결정 항목 중 **"게재 프로젝트 선별"**을 확정한다.
Phase 0에서 seed에 넣은 12건 중 어떤 것을 `is_published = true`로 켤지 결정하고, 결과를 스펙 문서에 반영한다.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "chore: Phase 0 완료"
git push
```

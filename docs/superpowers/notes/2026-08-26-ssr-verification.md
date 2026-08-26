# ispark-ui SSR 검증 결과 (2026-08-26)

Phase 0 Task 3~5의 산출물. Phase 1~3에서 `<ClientOnly>` 적용 여부를 판단하는 근거다.

## 환경

| 항목 | 버전 |
|------|------|
| Nuxt | 3.21.11 (Nitro 2.13.4, Vite 7.3.6, Vue 3.5.41) |
| `@leechanyong/ispark-ui` | 0.5.16 |
| Node | 24.14.0 |
| 검증 방식 | 프로덕션 빌드(`nuxt build`) → Nitro 서버 → fetch(SSR) + Playwright(하이드레이션) |

**검증 대상:** npm 0.5.16이 실제로 export하는 컴포넌트 32개
**결과:** SSR 500 없음, 하이드레이션 오류·경고 0건

---

## 1. SSR 정상 — 별도 처리 불필요 (28개)

아래 컴포넌트는 서버에서 마크업을 정상 생성하고, 브라우저에서 hydration mismatch가 발생하지 않았다.

| 그룹 | 컴포넌트 |
|------|---------|
| Form | `UiButton` `UiInput` `UiTextarea` `UiToggle` `UiCheckbox` `UiRadio` |
| Display | `UiBadge` `UiBadgeGroup` `UiAvatar` `UiAvatarGroup` `UiTable` `UiAccordion` `UiPagination` `UiIcon` |
| Overlay | `UiModal` `UiDropdownMenu` `UiDrawer` `UiTooltip` |
| Feedback | `UiEmpty` `UiLoading` |
| Data | `UiFileList` `UiFileUpload` `UiSelect` `UiMultiSelect` `UiDatePicker` `UiDateRangePicker` `UiTab` `UiCalendarMonth` |

### 특기 사항: radix-vue 오버레이는 안전하다

스펙 §5.3에서 "`UiModal`/`UiDropdownMenu`/`UiTooltip`/`UiDrawer`는 SSR 가능하나 Teleport 검증 필요"로
**미검증 가정**으로 남겨두었던 항목이다.

**검증 결과: 4개 모두 `<ClientOnly>` 없이 정상 동작한다.** 닫힌 상태에서는 Teleport 대상이 생성되지 않으므로
서버·클라이언트 렌더 결과가 일치한다. 스펙의 해당 항목을 해소 처리한다.

---

## 2. `<ClientOnly>` 적용 (4개)

| 컴포넌트 | 사유 | 근거 |
|---------|------|------|
| `UiChart` | Chart.js가 `<canvas>` 2D 컨텍스트에 의존 | 서버에 canvas 없음 (설계상 자명) |
| `UiMarkdownEditor` | TipTap이 DOM/ProseMirror에 의존 | 서버에 DOM 없음 (설계상 자명) |
| `UiToast` | 명령형 API(`openToast`)의 렌더 타깃 | **예방적 조치. SSR 실패를 실제로 관측하진 않았다** |
| `UiConfirm` | 명령형 API(`openConfirm`)의 렌더 타깃 | **예방적 조치. SSR 실패를 실제로 관측하진 않았다** |

> `UiToast` / `UiConfirm`은 처음부터 `<ClientOnly>`로 감싼 채 검증했으므로,
> 감싸지 않아도 되는지는 확인되지 않았다. Phase 3 어드민 구현 시 제거를 시도해볼 수 있다.

**`openToast()` / `openConfirm()` 호출 규칙:** 반드시 이벤트 핸들러 안에서만 호출한다.
`setup()` 최상단에서 부르면 서버에서 DOM에 접근하려다 죽는다.

---

## 3. ispark-ui 개선 권고

Phase 0에서 발견한 라이브러리 이슈. 포트폴리오 서사("SSR 대응을 위해 라이브러리를 개선했다")의 원자료이기도 하다.

### 3-1. `UiProgress`가 npm 배포본에 없음 🔴

| 위치 | 존재 여부 |
|------|----------|
| GitHub `src/index.ts` (main) | ✅ export 선언됨 |
| Storybook 문서 | ✅ 스토리 6개 게시됨 |
| **npm 0.5.16 ESM 번들** | ❌ **0회 등장** |
| **npm 0.5.16 CJS 번들** | ❌ **0회 등장** |
| **npm 0.5.16 `index.d.ts`** | ❌ **0회 등장** |

Storybook 문서를 보고 `npm install` 한 사용자는 문서에 있는 컴포넌트를 쓸 수 없다.
빌드 시점에 `"UiProgress" is not exported by dist/ispark-ui.js`로 실패한다.

**원인:** npm 배포본이 레포 main보다 뒤처져 있다.
**조치:** 재배포(publish). 배포 후 스모크 페이지에 `UiProgress` 복구.

### 3-2. `UiFileList`의 `getUrl` 누락 시 오류 메시지가 불친절 🟡

```ts
getUrl: (path: string) => string   // 필수 prop, 기본값·가드 없음
```

컴포넌트가 `t.getUrl(i.path)`를 무조건 호출하므로, 누락 시 SSR 500과 함께
`t10.getUrl is not a function`이라는 난독화된 메시지가 나온다. 어느 컴포넌트인지 알 수 없다.

**타입 정의 자체는 정확하다**(optional 아님). 다만 런타임 실패 모드가 나쁘다.

**조치 제안:** 기본값 `(path) => path` 부여 또는 호출부 가드 추가.

### 3-3. 다크 테마 팔레트 부재 🟡

`dist/ispark-ui.css`의 `:root` 블록은 1개뿐이며, 27개 CSS 변수 전부 라이트 테마 값이다.
다크 모드를 쓰려면 소비자가 27개를 전부 재정의해야 한다.

이 프로젝트는 `assets/css/tokens.css`에서 전체를 보강했다.
**조치 제안:** 라이브러리에 `@media (prefers-color-scheme: dark)` 및 `[data-theme="dark"]` 팔레트 추가.

### 3-4. README가 낡음 🟡

"테스트 단계 (v0.1.x)", "npm registry 설치 (예정 — 미정)"로 적혀 있으나 실제로는 v0.5.16 배포 완료.
→ Phase 0 Task 11에서 처리.

---

## 4. API 사용 시 주의 (Phase 1~3 참고)

계획 수립 시 추측했던 것과 실제가 달랐던 항목들이다. 구현 전 반드시 확인한다.

| 컴포넌트 | 추측 | **실제** |
|---------|------|---------|
| `UiTable` | `:rows` | **`:data`** (+ `:columns`) |
| `UiDropdownMenu` | default 슬롯에 트리거 | **`#trigger` 네임드 슬롯** |
| `UiFileList` | `FileItem { name, size }` | **`{ id, filename, path, mimetype }`** + **`getUrl` 필수** |
| `UiDateRangePicker` | `{ start: '', end: '' }` | **`DateValue`** (`@internationalized/date`) |
| `UiPagination` | `:per-page` | **`:total-count` + `:page-size`** |
| `UiEmpty` | `message` | **`text`** |

**교훈:** `typescript.typeCheck: true`를 켜면 위 대부분이 빌드 단계에서 잡힌다.
`nuxt.config.ts`에 활성화해두었다.

---

## 5. 재현 방법

```bash
# 전체 (빌드 포함)
npm test

# 빌드 재사용 (빠른 반복)
SKIP_BUILD=1 npx vitest run
```

컴포넌트 단위 격리 페이지는 `pages/smoke/iso/*.vue`에 있다.
그룹 페이지에서 500이 날 때 어느 컴포넌트인지 특정하는 용도다.

> **정리 대상:** `pages/smoke/**`는 검증용이다. Phase 4에서 프로덕션 빌드 제외 여부를 결정한다.

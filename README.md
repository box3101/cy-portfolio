# cy-portfolio

이찬용 포트폴리오 사이트. Nuxt 3 + Supabase + [`@leechanyong/ispark-ui`](https://www.npmjs.com/package/@leechanyong/ispark-ui) 기반.

직접 만든 디자인 시스템 `ispark-ui`로 이 사이트를 만든다. 시스템을 만든 것과 그 시스템으로 제품을 만들 수 있는 것은 다르므로, 사이트 자체가 증거가 되게 한다.

## 스택

| 레이어 | 선택 |
| --- | --- |
| 프레임워크 | Nuxt 3 (SSR / ISR) |
| UI | `@leechanyong/ispark-ui` (Vue 3 + radix-vue) |
| 데이터 | Supabase (Postgres + Auth + Storage) |
| 배포 | Vercel |

## 개발

```bash
npm install
cp .env.example .env     # Supabase URL / publishable key 입력
npm run dev              # http://localhost:3000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 (템플릿 타입체크 포함) |
| `npm test` | SSR + 하이드레이션 검증 (빌드 후 실제 서버에 요청) |
| `SKIP_BUILD=1 npx vitest run` | 기존 빌드 재사용, 빠른 반복 |
| `npm run db:check` | 마이그레이션·seed를 PGlite에서 실행 검증 (Docker 불필요) |

## 테스트

`test/`는 `ispark-ui` 33개 컴포넌트가 Nuxt 3 SSR에서 정상 동작하는지 검증한다.

- `ssr-smoke.test.ts` — 서버가 실제 마크업을 생성하는지
- `hydration.test.ts` — 브라우저 콘솔 오류 0건인지 (Playwright)

`@nuxt/test-utils`의 인프로세스 빌드 대신 자식 프로세스에서 `nuxt build` 후 Nitro 서버에
요청한다. 배포되는 프로덕션 출력을 그대로 검증하기 위해서다.

## 데이터베이스

```
supabase/migrations/0001_init.sql   테이블 6개 + 인덱스 + 트리거
supabase/migrations/0002_rls.sql    RLS 정책 12개
supabase/seed.sql                   초기 데이터 (멱등)
```

스키마를 바꾸면 `npm run db:check`로 먼저 검증한 뒤 대시보드 SQL Editor에서 적용하고,
`types/database.ts`를 함께 갱신한다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [설계](docs/superpowers/specs/2026-08-26-portfolio-design.md) | 목적·범위·아키텍처·데이터 모델·로드맵 |
| [Phase 0 계획](docs/superpowers/plans/2026-08-26-phase0-foundation.md) | 기반 구축 작업 단위 |
| [SSR 검증 결과](docs/superpowers/notes/2026-08-26-ssr-verification.md) | 컴포넌트별 SSR 판정, ispark-ui 개선 권고 |

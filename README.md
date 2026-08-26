<div align="center">

# Cy's Code Canvas

**이찬용 포트폴리오 — Nuxt 3 + Supabase + ispark-ui**

[![Nuxt3](https://img.shields.io/badge/Nuxt_3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## Overview

직접 만든 디자인 시스템 [ispark-ui](https://github.com/box3101/ispark-ui)로 구축한 포트폴리오 사이트입니다.  
시스템을 만드는 것과, 그 시스템으로 제품을 만드는 것은 다릅니다. 이 사이트 자체가 그 증거입니다.

## Tech Stack

| 영역 | 기술 |
|------|------|
| **Framework** | Nuxt 3 (SSR/ISR) |
| **Database** | Supabase (PostgreSQL + RLS) |
| **UI** | [@leechanyong/ispark-ui](https://www.npmjs.com/package/@leechanyong/ispark-ui) |
| **Deploy** | Vercel |
| **Test** | Vitest + Playwright |

## Key Features

- **프로젝트 갤러리** — 카테고리 필터, 검색, 상세 페이지
- **경력 타임라인** — 회사별 경력 + 프로젝트 이력
- **아카이브** — 인증서·자료 PDF 뷰어
- **다크 모드** — 테마 전환
- **SSR + ISR** — SEO 최적화 + 빠른 응답

## Project Structure

```
├── pages/              # 라우트 페이지
├── components/         # UI 컴포넌트
├── composables/
│   ├── api/            # Supabase 쿼리
│   └── store/          # useState 스토어
├── layouts/            # default, hero
└── supabase/
    ├── migrations/     # DB 스키마
    └── seed.sql        # 초기 데이터
```

## Getting Started

```bash
# .env 설정
cp .env.example .env
# NUXT_PUBLIC_SUPABASE_URL, NUXT_PUBLIC_SUPABASE_ANON_KEY 입력

npm install
npm run dev
```

## Links

- **Live** — [포트폴리오 사이트](https://cy-portfolio.vercel.app/)
- **Design System** — [ispark-ui Storybook](https://box3101.github.io/ispark-ui/)

---

<div align="center">
  <sub>Built by <a href="https://github.com/box3101">@box3101</a></sub>
</div>

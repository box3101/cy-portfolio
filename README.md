<p align="center">
<br>
<a href="https://cy-portfolio.vercel.app/"><img src="https://img.shields.io/badge/Cy's_Code-Canvas-e91e8c?style=for-the-badge" alt="Cy's Code Canvas" /></a>
<br><br>
</p>

# Cy's Code Canvas

> 직접 만든 디자인 시스템으로 구축한 포트폴리오

<p>
<a href="https://nuxt.com/"><img src="https://img.shields.io/badge/-Nuxt_3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white" /></a>
<a href="https://supabase.com/"><img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" /></a>
<a href="https://www.npmjs.com/package/@leechanyong/ispark-ui"><img src="https://img.shields.io/badge/-ispark--ui-6366f1?style=flat-square" /></a>
<a href="https://vercel.com/"><img src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" /></a>
</p>

---

시스템을 만드는 것과, 그 시스템으로 제품을 만드는 것은 다릅니다.  
이 사이트 자체가 [ispark-ui](https://github.com/box3101/ispark-ui)의 증거입니다.

### Links

🔗 **[cy-portfolio.vercel.app](https://cy-portfolio.vercel.app/)** · **[ispark-ui Storybook](https://box3101.github.io/ispark-ui/)**

### Features

| | |
|---|---|
| **프로젝트 갤러리** | 카테고리 필터 + 검색 + 상세 페이지 |
| **경력 타임라인** | 회사별 경력 + 프로젝트 이력 |
| **아카이브** | 인증서·자료 PDF 뷰어 |
| **다크 모드** | 테마 전환 |
| **SSR + ISR** | SEO 최적화 + 빠른 응답 |

### Structure

```
├── pages/              # 라우트
├── components/         # UI 컴포넌트
├── composables/
│   ├── api/            # Supabase 쿼리
│   └── store/          # useState 스토어
└── supabase/
    ├── migrations/     # DB 스키마 + RLS
    └── seed.sql        # 초기 데이터
```

### Setup

```bash
cp .env.example .env    # Supabase URL + Key 입력
npm install && npm run dev
```

---

<sub>Built by <a href="https://github.com/box3101">@box3101</a> · 이찬용</sub>

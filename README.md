<p align="center">
<br>
<a href="https://cy-portfolio.vercel.app/"><img src="https://img.shields.io/badge/Cy's_Code-Canvas-e91e8c?style=for-the-badge" /></a>
<br><br>
<strong>시스템을 만들고, 그 시스템으로 제품을 만듭니다.</strong>
<br><br>
<a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt_3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white" /></a>
<a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" /></a>
<a href="https://www.npmjs.com/package/@leechanyong/ispark-ui"><img src="https://img.shields.io/badge/ispark--ui-6366f1?style=flat-square" /></a>
<a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" /></a>
</p>

---

### About

직접 만든 디자인 시스템 [ispark-ui](https://github.com/box3101/ispark-ui)로 구축한 포트폴리오입니다.

디자인 시스템을 npm에 올리는 건 시작일 뿐입니다.  
그걸로 **실제 제품을 만들어서 돌아가는 걸 보여주는 것**이 진짜 증명입니다.  
이 사이트가 그 증거입니다.

🔗 **[cy-portfolio.vercel.app](https://cy-portfolio.vercel.app/)**

### Architecture

| Layer | Stack | Role |
|-------|-------|------|
| **Framework** | Nuxt 3 (SSR/ISR) | SEO + 빠른 응답 |
| **Database** | Supabase (PostgreSQL) | RLS 기반 보안 쿼리 |
| **UI** | ispark-ui | 디자인 시스템 실전 적용 |
| **Test** | Vitest + Playwright | SSR 스모크 + E2E |
| **Deploy** | Vercel | main push 시 자동 배포 |

### Pages

**🏠 Hero** — 풀스크린 비디오 랜딩. 영상 위 타이포그래피와 CTA.

**💼 Projects** — 카테고리 필터 + 검색. 프로젝트별 로고와 hover 오버레이.

**📄 Archive** — 웹 접근성 인증서, 발표자료 등 PDF 뷰어.

**👤 About** — 경력 타임라인 + 기술 스택 프로그레스 바.

**🌓 Dark Mode** — ispark-ui 테마 토큰 기반 전환.

### Setup

```bash
cp .env.example .env    # Supabase URL + Anon Key
npm install && npm run dev
```

---

<sub>이찬용 · <a href="https://github.com/box3101">@box3101</a></sub>

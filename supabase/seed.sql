-- supabase/seed.sql
-- 초기 데이터. 여러 번 실행해도 안전하다(idempotent).
--
-- 프로젝트는 전부 is_published = false 로 넣는다.
--   1) 게재 대상 선별이 아직 미결정이다 (스펙 §13)
--   2) anon 조회가 []로 나오는지 확인해 RLS가 실제로 걸렸는지 검증한다
-- 어드민(Phase 3) 또는 SQL로 개별 공개 전환한다.
--
-- 아카이브(인증서)는 여기 없다. PDF 개인정보 마스킹 검수(Task 9)를 통과한 파일만 등록한다.

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
  name     = excluded.name,
  headline = excluded.headline,
  bio      = excluded.bio,
  email    = excluded.email;

-- ===== 프로젝트 =====
insert into public.projects
  (slug, title, subtitle, summary, category, period_start, period_end,
   tags, role, repo_url, live_url, sort_order, is_featured, is_published)
values
  ('ispark-ui', 'ispark-ui 디자인 시스템', 'Design System',
   'Vue3 · radix-vue 기반 디자인 시스템. 컴포넌트 33개, 스토리 280개 이상, npm 퍼블리시.',
   'vue-nuxt', '2025-04-28', null,
   array['Vue3', 'radix-vue', 'Storybook', 'TypeScript', 'npm'],
   '기획·설계·구현 전체',
   'https://github.com/box3101/ispark-ui',
   'https://box3101.github.io/ispark-ui/',
   10, true, false),

  ('taskflow', 'TaskFlow 프로젝트 관리 앱', 'Full-stack',
   'ispark-ui로 만든 풀스택 프로젝트 관리 앱. Vue3+TS 프론트, Express+Prisma+PostgreSQL 백엔드, JWT 인증.',
   'vue-nuxt', '2026-08-01', null,
   array['Vue3', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'ispark-ui'],
   '프론트엔드·백엔드·DB 설계 전체',
   'https://github.com/box3101/taskflow',
   'https://ispark-task.up.railway.app/',
   20, true, false),

  ('sgate-okr-solution', '이즈파크 AX Group 성과관리 솔루션', '성과관리 솔루션 개발',
   'Vue3·Nuxt3·Pinia 기반 성과관리 솔루션. 디자인 컴포넌트 시스템 구축 및 UI/UX 최적화.',
   'vue-nuxt', '2025-03-01', null,
   array['Vue3', 'Nuxt3', 'Pinia', '디자인 시스템'],
   '프론트엔드 개발 · 디자인 시스템 구축',
   null, null,
   30, true, false),

  ('movie-dashboard', '박스오피스 대시보드', 'Data Dashboard',
   'Nuxt3 + Supabase + KOBIS 박스오피스 API 기반 대시보드.',
   'vue-nuxt', '2026-08-24', null,
   array['Nuxt3', 'Supabase', 'KOBIS API'],
   '개인 프로젝트',
   'https://github.com/box3101/movie-dashboard',
   'https://movie-dashboard-two-khaki.vercel.app',
   40, false, false),

  ('yeonsu-library-website', '연수구립도서관 공식 웹사이트', '도서관 공식 웹사이트',
   'Astro 4.15 기반 정적 사이트. SCSS 7-1 아키텍처 + BEM, 재사용 UI 컴포넌트 시스템 구축.',
   'astro', '2025-03-01', null,
   array['Astro', 'SCSS', 'Nanostores', 'Swiper.js'],
   '퍼블리싱 · 컴포넌트 설계',
   'https://github.com/box3101/yeonsu-library-web', null,
   50, false, false),

  ('korean-bank-evaluation', '한국은행 직원평가시스템', 'Employee Evaluation System',
   '기획-디자인-개발 올인원으로 빌드업한 직원평가 시스템. Astro 기반.',
   'astro', '2023-07-01', '2024-01-31',
   array['Astro', '적응형', '웹 접근성', '인터랙션'],
   '기획 · 디자인 · 개발',
   null, null,
   60, false, false),

  ('incheon-jung-gu-edu', '인천광역시 중구청 평생교육포털', 'Lifelong Education Portal',
   'Front 및 관리자 화면 UI 개발. gulp 대신 Astro를 도입해 개발 효율 개선.',
   'astro', '2022-10-01', '2023-03-31',
   array['Astro', '반응형', '웹 접근성'],
   'Front · Admin UI 개발',
   null, 'https://edu.icjg.go.kr/',
   70, false, false),

  ('incheon-city', '인천광역시 웹사이트 · 패밀리 사이트', 'Public Sector Web Development',
   '3년간 유지보수 및 개선. 2021.03 웹 접근성 마크 획득, 2021.10 행정안전부 품질관리 우수평가, 2022.03 갱신.',
   'publisher', '2020-01-01', '2022-12-31',
   array['공공기관', '웹 접근성', '품질관리 우수평가', '장기 프로젝트'],
   '퍼블리싱 · 유지보수',
   null, 'https://www.incheon.go.kr/index',
   80, false, false),

  ('samsung-sdi-gsop', '삼성 SDI GSOP 시스템', 'Enterprise System Development',
   'Global Standard Operation Procedure 시스템의 Admin 화면 개발 및 테마 커스터마이징.',
   'publisher', '2023-02-01', '2023-08-31',
   array['Admin 개발', '시스템 커스터마이징', '기업 솔루션'],
   'Admin 화면 개발',
   null, null,
   90, false, false),

  ('g4b-business-support', 'G4b 기업지원 플러스 리뉴얼', 'Business Support Platform',
   '기업지원 플러스 Front 화면 리뉴얼. 웹 접근성 마크 획득.',
   'publisher', '2022-04-01', '2022-07-31',
   array['반응형', '인터랙티브', '웹 접근성', '리뉴얼'],
   'Front 개발',
   null, null,
   100, false, false),

  ('ict-ksa-system', 'ICT 한국표준협회 성과관리 시스템', 'Performance Management System',
   'ICT 산업 표준화를 위한 성과관리 시스템 Front 화면 개발.',
   'publisher', '2022-07-01', '2022-11-30',
   array['반응형', '인터랙티브', '성과관리 시스템'],
   'Front 개발',
   null, 'https://rnd.tta.or.kr/user/main/main/main',
   110, false, false),

  ('animal-flash-cards', '동물 플래시 카드', 'toy project',
   '아이를 위한 동물 플래시 카드 웹 앱. 다국어(한/영) 지원, 이미지 로딩 최적화.',
   'react', '2023-06-03', '2023-06-16',
   array['React', '상태 관리', '다국어', '교육용 앱'],
   '개인 프로젝트',
   'https://github.com/box3101/AnimalCards/', null,
   120, false, false)
on conflict (slug) do nothing;

-- ===== 경력 =====
-- sort_order 는 최신순이다(작을수록 위).
-- 여기만 do nothing 대신 do update 다. 이미 들어간 행(이즈파크 AX Group)의
-- position·description 을 고쳐야 해서, do nothing 이면 영원히 옛 값이 남는다.
insert into public.careers (company, position, period_start, period_end, description, sort_order)
values
  ('이즈파크 AX Group', '책임연구원', '2025-03-01', null,
   'AI 플랫폼과 성과관리 솔루션의 프론트엔드를 맡고 있다. 사내 디자인시스템 ispark-ui를 설계·배포한다.', 10),

  ('프레임아웃 (LG유플러스 파견)', '프리랜서', '2024-06-01', '2025-03-01',
   '레거시 jQuery 기반 사전예약 시스템을 모듈화하고 성능을 개선했다.', 20),

  ('포켓컴퍼니 UI개발팀', '과장', '2024-02-01', '2024-06-01',
   'CRM 고객경험 플랫폼의 대시보드와 디자인 시스템을 구축했다.', 30),

  ('이즈파크 공공/금융사업본부', '대리', '2020-01-01', '2024-02-01',
   '인천광역시 통합 웹사이트 20개를 구축·운영하며 웹 접근성 인증을 담당했다.', 40),

  ('KynNetworks', '대리', '2019-01-01', '2019-12-01',
   '대규모 인력 중개 플랫폼 WEEP의 UI/UX 퍼블리싱을 담당했다.', 50)
on conflict (company, period_start) do update
  set position    = excluded.position,
      period_end  = excluded.period_end,
      description = excluded.description,
      sort_order  = excluded.sort_order;

-- ===== 경력 프로젝트 =====
-- career_id 는 자연키(company, period_start)로 되찾는다.
-- UUID 를 seed 에 하드코딩하면 환경마다 달라져 재실행이 깨진다.
insert into public.career_projects (career_id, title, tech_stack, outcome, highlights, sort_order)
values
  -- ----- 이즈파크 AX Group -----
  ((select id from public.careers where company = '이즈파크 AX Group' and period_start = '2025-03-01'),
   'TeamAgent AI 플랫폼 프론트엔드 개발',
   array['Vue3', 'TypeScript', 'Element Plus', 'Pinia'],
   null,
   array[
     '제조 현장 문서·데이터를 통합한 RAG 기반 AI 플랫폼 프론트엔드 개발',
     '자연어 질의 → 문서 검색 → 데이터 조회 → 보고서 생성으로 이어지는 단일 워크플로우 UI 설계 및 구현',
     'AI 챗봇 인터페이스 및 PDF 문서 시각화 대시보드 개발'
   ], 10),

  ((select id from public.careers where company = '이즈파크 AX Group' and period_start = '2025-03-01'),
   'SGATE 성과관리 솔루션 개발',
   array['Vue3', 'Nuxt.js', 'TypeScript', 'Pinia'],
   '개발 속도 30% 향상',
   array[
     '서비스 리뉴얼 기획 단계부터 참여, 프론트엔드 메인 설계 담당 (기여도 100%)',
     '재사용 가능한 UI 컴포넌트 30종을 사내 디자인시스템 ispark-ui로 설계·패키징, npm 배포로 사내 공통 적용',
     '시맨틱 버저닝 기반 릴리즈 체계 수립으로 다중 프로젝트 동시 운영 시 버전 충돌 방지',
     'Pinia 상태관리 도입으로 기존 Vuex 대비 코드 복잡도 30% 감소',
     'AI 워크플로우 도입으로 개발 효율 40% 향상 및 코드 품질 개선'
   ], 20),

  ((select id from public.careers where company = '이즈파크 AX Group' and period_start = '2025-03-01'),
   '마케팅 업무 프로세스 최적화',
   array['React', 'Next.js', 'TypeScript'],
   '랜딩페이지 제작 시간 75% 단축',
   array[
     'Cursor.ai와 Figma MCP를 결합한 디자인-코드 자동화로 마케팅 랜딩페이지 제작 시간 75% 단축 (기여도 100%)',
     'Lazy Loading, Code Splitting 적용으로 페이지 로딩 속도 40% 개선',
     'Notion MCP 기반 요청사항 관리 체계 구축으로 마케팅팀 협업 프로세스 개선'
   ], 30),

  -- ----- 프레임아웃 (LG유플러스 파견) -----
  ((select id from public.careers where company = '프레임아웃 (LG유플러스 파견)' and period_start = '2024-06-01'),
   '갤럭시 S25 사전예약 시스템 최적화',
   array['React', 'Vue3', 'JavaScript', 'SCSS'],
   '사전예약 목표 달성률 135% 기여',
   array[
     'jQuery → ES6 모듈화 리팩토링으로 성능 개선하여 사전 예약 목표 달성률 135% 기여',
     'Cursor.ai 활용 레거시 jQuery 코드를 ES6 모던 JavaScript로 전환',
     '코드 모듈화로 유지보수성 향상 및 개발 환경 개선',
     'Astro 기반 이벤트 관리 대시보드 개발로 운영팀 효율성 향상 (기여도 100%)'
   ], 10),

  -- ----- 포켓컴퍼니 -----
  ((select id from public.careers where company = '포켓컴퍼니 UI개발팀' and period_start = '2024-02-01'),
   'PoketCRM 고객경험 플랫폼 개발',
   array['Vue.js', 'Vuex', 'Vuetify', 'SCSS'],
   null,
   array[
     'CRM 대시보드 컴포넌트 설계 및 구현',
     'Vuetify 기반 일관된 디자인 시스템 구축',
     '고객 데이터 시각화 차트 개발'
   ], 10),

  -- ----- 이즈파크 공공/금융사업본부 -----
  ((select id from public.careers where company = '이즈파크 공공/금융사업본부' and period_start = '2020-01-01'),
   '인천광역시 통합 웹사이트 운영',
   array['JavaScript', 'SCSS', 'Astro', 'jQuery'],
   '웹 접근성 인증 8회 취득 · 로딩속도 70% 개선 (6초 → 2초)',
   array[
     '20개 사이트 구축·운영 및 웹 접근성 인증 담당',
     '프론트엔드팀 관리 및 팀원 JavaScript/SPA 프레임워크 교육 진행',
     'Astro 프레임워크 도입으로 자바 개발자와의 협업 효율성 개선',
     '대규모 SI 프로젝트 수행: 금융감독원, 한국은행, 삼성SDI, 인천 중구청',
     'Git 활용 협업 환경 구축 및 팀 생산성 향상'
   ], 10),

  -- ----- KynNetworks -----
  ((select id from public.careers where company = 'KynNetworks' and period_start = '2019-01-01'),
   'WEEP — 대규모 인력 중개사이트 UI/UX 구축',
   array['HTML', 'CSS', 'JavaScript', 'jQuery'],
   null,
   array[
     '인력관리 중개 플랫폼 퍼블리싱 담당',
     '복잡한 인력 관리 시스템의 사용자 경험 최적화',
     '반응형 웹 디자인 적용으로 다양한 디바이스 지원'
   ], 10)
on conflict (career_id, title) do update
  set tech_stack = excluded.tech_stack,
      outcome    = excluded.outcome,
      highlights = excluded.highlights,
      sort_order = excluded.sort_order;

-- ===== 스킬 =====
insert into public.skills (name, category, level, sort_order)
values
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
on conflict (name) do nothing;

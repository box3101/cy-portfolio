-- supabase/migrations/0001_init.sql
-- 포트폴리오 사이트 기본 스키마
-- 적용: Supabase 대시보드 → SQL Editor 에 전체 붙여넣고 실행

-- ===== 프로젝트 =====
create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  subtitle       text,
  summary        text,
  category       text not null check (category in ('vue-nuxt', 'astro', 'react', 'publisher')),
  period_start   date not null,
  period_end     date,                                   -- null = 진행중
  content        text,                                   -- 마크다운 상세
  thumbnail_path text,
  repo_url       text,
  live_url       text,
  tags           text[] not null default '{}',
  role           text,
  sort_order     int not null default 0,
  is_featured    boolean not null default false,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index projects_tags_idx      on public.projects using gin (tags);
create index projects_published_idx on public.projects (is_published, sort_order);
create index projects_category_idx  on public.projects (category);

-- ===== 아카이브 (인증서·자료) =====
create table public.archives (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  doc_type       text not null check (doc_type in ('증명서', '포트폴리오', '기타')),
  issuer         text,
  issued_on      date,
  file_path      text not null,
  thumbnail_path text,                                   -- PDF 1페이지 캡처
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
  period_end   date,                                     -- null = 재직중
  description  text,
  sort_order   int not null default 0,
  -- seed 재실행 시 중복 삽입을 막기 위한 자연키
  unique (company, period_start)
);

-- ===== 스킬 =====
create table public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  category   text not null check (category in ('language', 'framework', 'tool', 'design')),
  level      int not null check (level between 1 and 5),
  sort_order int not null default 0
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
-- /admin 대시보드 UiChart의 실제 데이터 소스.
-- 더미 데이터로 차트를 채우지 않기 위해 둔다.
create table public.page_views (
  id         bigserial primary key,
  path       text not null,
  referrer   text,
  created_at timestamptz not null default now()
);

create index page_views_created_idx on public.page_views (created_at desc);

-- ===== updated_at 자동 갱신 =====
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger profile_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

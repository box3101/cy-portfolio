-- supabase/migrations/0002_rls.sql
-- Row Level Security 정책
-- 원칙: anon은 공개된 것만 읽는다. 쓰기는 authenticated(본인 계정 1개)만.
-- 적용: 0001_init.sql 실행 후 이어서 실행

alter table public.projects   enable row level security;
alter table public.archives   enable row level security;
alter table public.careers    enable row level security;
alter table public.skills     enable row level security;
alter table public.profile    enable row level security;
alter table public.page_views enable row level security;

-- ===== 공개 읽기 — is_published = true 인 행만 =====
create policy "공개 프로젝트 읽기" on public.projects
  for select to anon
  using (is_published = true);

create policy "공개 아카이브 읽기" on public.archives
  for select to anon
  using (is_published = true);

-- 경력·스킬·프로필은 공개 여부 컬럼이 없다. 전체가 공개 대상이다.
create policy "경력 읽기" on public.careers
  for select to anon
  using (true);

create policy "스킬 읽기" on public.skills
  for select to anon
  using (true);

create policy "프로필 읽기" on public.profile
  for select to anon
  using (true);

-- ===== 방문 로그 — 익명 쓰기만, 읽기는 관리자만 =====
create policy "방문 로그 기록" on public.page_views
  for insert to anon
  with check (true);

create policy "방문 로그 조회" on public.page_views
  for select to authenticated
  using (true);

-- ===== 관리자 — 전체 권한 =====
-- 회원가입을 비활성화하고 계정 1개만 운영하므로 authenticated = 본인이다.
create policy "관리자 프로젝트" on public.projects
  for all to authenticated using (true) with check (true);

create policy "관리자 아카이브" on public.archives
  for all to authenticated using (true) with check (true);

create policy "관리자 경력" on public.careers
  for all to authenticated using (true) with check (true);

create policy "관리자 스킬" on public.skills
  for all to authenticated using (true) with check (true);

create policy "관리자 프로필" on public.profile
  for all to authenticated using (true) with check (true);

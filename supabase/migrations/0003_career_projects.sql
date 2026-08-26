-- supabase/migrations/0003_career_projects.sql
-- 경력 안의 "프로젝트" 분리
-- 적용: 0002_rls.sql 실행 후 이어서 실행
--
-- 왜 테이블을 나누나
--   careers.description 은 회사당 텍스트 한 덩어리다. 그런데 실제 이력은
--   한 회사에서 성격이 다른 프로젝트를 여러 개 맡는다(현직만 3개).
--   기술 스택·성과를 문자열에 욱여넣으면 화면에서 태그·목록으로 나눌 수 없고,
--   나중에 "React 쓴 프로젝트만" 같은 조회도 못 한다.

-- ===== 경력 프로젝트 =====
create table public.career_projects (
  id         uuid primary key default gen_random_uuid(),
  career_id  uuid not null references public.careers (id) on delete cascade,
  title      text not null,
  -- 화면에서 태그 칩으로 렌더한다. 비어 있을 수 있다(퍼블리싱 위주 경력 등).
  tech_stack text[] not null default '{}',
  -- 한 줄로 요약되는 대표 성과. 없으면 null.
  outcome    text,
  -- 불릿 목록. 줄바꿈 섞인 단일 텍스트로 두면 화면에서 <li> 로 못 나눈다.
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  -- seed 재실행 시 중복 삽입을 막기 위한 자연키
  unique (career_id, title)
);

-- 회사별 조회가 기본 접근 경로다.
create index career_projects_career_idx
  on public.career_projects (career_id, sort_order);

-- ===== RLS =====
-- careers 와 같은 취급이다. 공개 여부 컬럼 없이 전체가 공개 대상.
alter table public.career_projects enable row level security;

create policy "경력 프로젝트 읽기" on public.career_projects
  for select to anon
  using (true);

create policy "관리자 경력 프로젝트" on public.career_projects
  for all to authenticated using (true) with check (true);

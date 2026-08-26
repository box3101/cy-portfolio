-- supabase/seed_archives.sql
--
-- /archive 게시판 데이터. Supabase SQL Editor 에 붙여넣어 실행한다.
--
-- 선행 조건: Storage 의 `documents` 버킷(public)에 아래 파일 12개가
--            같은 이름으로 올라가 있어야 한다.
--            로컬 스테이징 폴더: .archive-upload/
--
-- 다시 실행해도 안전하도록 file_path 기준으로 upsert 한다.
--            (0004_archives_file_path_unique.sql 을 먼저 적용해야 한다)

insert into public.archives
  (title, doc_type, issuer, issued_on, file_path, description, sort_order, is_published)
values
  -- ===== 인증서 =====
  ('인천광역시 웹 접근성 인증서', '증명서', '한국웹접근성인증평가원', null,
   'accessibility-cert-incheon.pdf',
   '인천광역시 통합 사이트 웹 접근성 인증.', 10, true),

  ('인천광역시 웹 품질 우수등급 인증서', '증명서', '한국정보화진흥원', null,
   'quality-cert-incheon.pdf',
   '인천광역시 통합 사이트 웹 품질 우수등급.', 20, true),

  -- ===== 심사결과서 =====
  ('문화포털 심사결과서 (2차)', '증명서', '문화포털', '2023-12-01',
   'review-2023-12-culture-portal.pdf', null, 30, true),

  ('인천중구 교육포털 배우는바다 심사결과서 (2차)', '증명서', '인천광역시 중구', '2023-04-01',
   'review-2023-04-incheon-junggu-edu.pdf', null, 40, true),

  ('문화포털 심사결과서 (2차)', '증명서', '문화포털', '2023-03-01',
   'review-2023-03-culture-portal.pdf', null, 50, true),

  ('IFEZ 인천경제자유구역 심사결과서 (2차)', '증명서', '인천경제자유구역청', '2022-04-01',
   'review-2022-04-ifez.pdf', null, 60, true),

  ('인천광역시청 심사결과서 (2차)', '증명서', '인천광역시', '2022-03-01',
   'review-2022-03-incheon-city.pdf', null, 70, true),

  ('인천일자리포털 심사결과서 (2차)', '증명서', '인천광역시', '2021-12-01',
   'review-2021-12-incheon-jobs.pdf', null, 80, true),

  ('인천광역시청 심사결과서 (2차)', '증명서', '인천광역시', '2021-03-01',
   'review-2021-03-incheon-city.pdf', null, 90, true),

  -- ===== 포트폴리오 =====
  ('프론트엔드 상태관리 라이브러리 성능 분석', '포트폴리오', '졸업논문', null,
   'thesis-frontend-state-management.pdf',
   'Vuex · Pinia · Redux 의 렌더링 비용과 번들 크기를 비교한 졸업논문.', 100, true),

  -- ===== 기타 =====
  ('Cursor AI 활용 가이드 — 심화', '기타', '사내 교육자료', null,
   'cursor-guide-advanced.pdf',
   '팀 대상 Cursor 활용 심화 교육자료 v1.3.', 110, true),

  ('Cursor AI 활용 가이드 — 초심자', '기타', '사내 교육자료', null,
   'cursor-guide-beginner.pdf',
   '팀 대상 Cursor 입문 교육자료.', 120, true)

on conflict (file_path) do update set
  title       = excluded.title,
  doc_type    = excluded.doc_type,
  issuer      = excluded.issuer,
  issued_on   = excluded.issued_on,
  description = excluded.description,
  sort_order  = excluded.sort_order,
  is_published = excluded.is_published;

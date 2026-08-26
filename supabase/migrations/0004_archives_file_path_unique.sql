-- 0004: archives.file_path 에 유일 제약
--
-- 같은 파일을 가리키는 행이 둘이면 목록에 같은 문서가 두 번 뜬다.
-- 데이터 오류이므로 DB 레벨에서 막는다.
-- seed_archives.sql 의 upsert(on conflict (file_path))도 이 제약을 요구한다.

alter table public.archives
  add constraint archives_file_path_key unique (file_path);

/**
 * Supabase Storage 공개 파일 URL.
 *
 * supabase-js 의 getPublicUrl 을 쓰지 않는 이유:
 *   공개 버킷의 URL 은 규칙이 고정돼 있어 클라이언트가 필요 없다.
 *   useSupabase 가 client 를 밖으로 내보내지 않으므로(모든 조회는 runQuery 를
 *   거친다) 여기서 문자열로 만든다.
 *
 * @param bucket  documents · thumbnails · profile
 * @param path    버킷 안의 경로. 비어 있으면 null 을 돌려준다.
 */
export const publicFileUrl = (bucket: string, path: string | null | undefined): string | null => {
  if (!path) return null

  const base = String(useRuntimeConfig().public.supabaseUrl).replace(/\/$/, '')
  if (!base) return null

  // 경로에 공백·한글·괄호가 들어갈 수 있다. 슬래시는 구분자로 남겨야 하므로
  // 세그먼트 단위로 인코딩한다.
  const encoded = path
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')

  return `${base}/storage/v1/object/public/${bucket}/${encoded}`
}

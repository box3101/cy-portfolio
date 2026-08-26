import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

type Client = SupabaseClient<Database>
type QueryResult<T> = { data: T | null; error: { message: string } | null }

/**
 * Supabase 클라이언트 래퍼.
 *
 * CLAUDE.md의 `useApi` 역할을 한다. 페이지·컴포넌트에서 createClient를 직접 부르지 않고
 * 반드시 이 composable을 거친다. 에러 처리와 로깅을 한 곳에 모으기 위함이다.
 *
 * 클라이언트는 요청 간 상태를 갖지 않는 읽기 전용 설정이므로 모듈 스코프 캐시가 안전하다.
 * (인증 세션을 붙이는 Phase 3에서는 요청별 인스턴스로 바꿔야 한다)
 *
 * ⚠️ 이 파일은 예외를 밖으로 내보내지 않는다.
 *    레이아웃(default·hero)이 프로필을 조회하므로 여기서 던지면 그 한 번의 실패가
 *    사이트 전체를 500으로 만든다. 실제로 첫 배포 때 환경변수가 없어 모든 라우트가
 *    죽었다.
 *    대신 빈 값(null)을 돌려주고 서버 로그에 남긴다. 샘플·폴백 데이터로 대체하지는
 *    않는다 — 화면이 정상처럼 보여 버그를 숨기기 때문이다.
 */
let client: Client | null = null

/** 환경변수 경고는 요청마다 찍지 않고 프로세스당 한 번만 남긴다. */
let configWarned = false

export const useSupabase = () => {
  const config = useRuntimeConfig()

  if (!client) {
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey

    if (url && key) {
      client = createClient<Database>(url, key, {
        auth: { persistSession: false }, // Phase 1은 공개 읽기 전용
      })
    } else if (!configWarned) {
      configWarned = true
      console.error(
        '[supabase] 환경변수가 없습니다. NUXT_PUBLIC_SUPABASE_URL / ' +
          'NUXT_PUBLIC_SUPABASE_ANON_KEY 를 확인하세요. ' +
          '클라이언트를 만들 수 없어 모든 조회가 빈 값으로 응답합니다.',
      )
    }
  }

  /**
   * 쿼리 실행 + 공통 에러 처리.
   *
   * 쿼리를 완성된 객체가 아니라 **함수로** 받는다. 클라이언트가 없을 때
   * `client.from(...)` 자체를 부르지 않고 건너뛰기 위함이다.
   *
   * 세 가지 실패를 전부 null로 흡수한다.
   *   1) 클라이언트 없음 — 환경변수 누락
   *   2) Postgres·RLS 에러 — error 객체로 온다
   *   3) 네트워크 실패 — error 객체가 아니라 예외로 온다
   */
  const runQuery = async <T>(
    label: string,
    build: (client: Client) => PromiseLike<QueryResult<T>>,
  ): Promise<T | null> => {
    if (!client) {
      console.error(`[supabase] ${label} 건너뜀 — 클라이언트가 없습니다.`)
      return null
    }

    try {
      const { data, error } = await build(client)

      if (error) {
        console.error(`[supabase] ${label} 실패: ${error.message}`)
        return null
      }
      return data
    } catch (e) {
      console.error(`[supabase] ${label} 예외:`, e)
      return null
    }
  }

  return { runQuery }
}

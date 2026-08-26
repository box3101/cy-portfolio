import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

/**
 * Supabase 클라이언트 래퍼.
 *
 * CLAUDE.md의 `useApi` 역할을 한다. 페이지·컴포넌트에서 createClient를 직접 부르지 않고
 * 반드시 이 composable을 거친다. 에러 처리와 로깅을 한 곳에 모으기 위함이다.
 *
 * 클라이언트는 요청 간 상태를 갖지 않는 읽기 전용 설정이므로 모듈 스코프 캐시가 안전하다.
 * (인증 세션을 붙이는 Phase 3에서는 요청별 인스턴스로 바꿔야 한다)
 */
let client: SupabaseClient<Database> | null = null

export const useSupabase = () => {
  const config = useRuntimeConfig()

  if (!client) {
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey

    if (!url || !key) {
      throw new Error(
        'Supabase 환경변수가 없습니다. .env의 NUXT_PUBLIC_SUPABASE_URL / NUXT_PUBLIC_SUPABASE_ANON_KEY 를 확인하세요.',
      )
    }

    client = createClient<Database>(url, key, {
      auth: { persistSession: false }, // Phase 1은 공개 읽기 전용
    })
  }

  /**
   * 쿼리 실행 + 공통 에러 처리.
   *
   * 실패 시 null을 반환하고 호출부가 빈 상태를 렌더하게 한다.
   * 샘플·폴백 데이터로 대체하지 않는다 — 화면이 정상처럼 보여 버그를 숨기기 때문이다.
   */
  const runQuery = async <T>(
    label: string,
    query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  ): Promise<T | null> => {
    const { data, error } = await query

    if (error) {
      console.error(`[supabase] ${label} 실패: ${error.message}`)
      return null
    }
    return data
  }

  return { client, runQuery }
}

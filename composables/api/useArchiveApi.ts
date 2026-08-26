import type { Archive } from '~/types/database'

export const useArchiveApi = () => {
  const { runQuery } = useSupabase()

  // ===== Archive =====

  /** 공개된 자료 목록. RLS가 is_published=false 를 막지만 쿼리에도 명시한다. */
  const fetchArchiveList = () =>
    runQuery<Archive[]>('자료 목록 조회', (c) =>
      c
        .from('archives')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
    )

  return { fetchArchiveList }
}

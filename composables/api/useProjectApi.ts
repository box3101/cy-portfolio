import type { Project, ProjectCategory } from '~/types/database'

export const useProjectApi = () => {
  const { runQuery } = useSupabase()

  // ===== Project =====

  /** 공개된 프로젝트 목록. category 를 주면 해당 분류만. */
  const fetchProjectList = (category?: ProjectCategory) =>
    runQuery<Project[]>('프로젝트 목록 조회', (c) => {
      const query = c
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })

      return category ? query.eq('category', category) : query
    })

  /** 상세 1건. 없으면 null. */
  const fetchProject = (slug: string) =>
    runQuery<Project>('프로젝트 상세 조회', (c) =>
      c.from('projects').select('*').eq('slug', slug).eq('is_published', true).maybeSingle(),
    )

  /** 분류별 건수 — 필터 탭에 표시한다. */
  const fetchCategoryCounts = async (): Promise<Record<string, number>> => {
    const rows = await runQuery<Pick<Project, 'category'>[]>('분류별 건수 조회', (c) =>
      c.from('projects').select('category').eq('is_published', true),
    )

    const counts: Record<string, number> = {}
    for (const r of rows ?? []) {
      counts[r.category] = (counts[r.category] ?? 0) + 1
    }
    counts.all = rows?.length ?? 0
    return counts
  }

  return { fetchProjectList, fetchProject, fetchCategoryCounts }
}

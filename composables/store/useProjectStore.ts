import type { Project, ProjectCategory } from '~/types/database'

export type CategoryFilter = ProjectCategory | 'all'

export const useProjectStore = () => {
  const { fetchProjectList, fetchProject, fetchCategoryCounts } =
    useProjectApi()

  // ===== 상태 변수 =====
  // 모듈 스코프 ref를 쓰면 SSR에서 요청 간 상태가 공유된다(cross-request pollution).
  // useState는 Nuxt가 요청별로 격리해준다.
  const projectList = useState<Project[]>('project/list', () => [])
  const selectedProject = useState<Project | null>('project/selected', () => null)
  const activeCategory = useState<CategoryFilter>('project/category', () => 'all')
  const categoryCounts = useState<Record<string, number>>('project/counts', () => ({}))

  // ===== 조회 =====
  const handleSelectProjectList = async () => {
    const category = activeCategory.value === 'all' ? undefined : activeCategory.value
    projectList.value = (await fetchProjectList(category)) ?? []
  }

  const handleSelectProject = async (slug: string) => {
    selectedProject.value = await fetchProject(slug)
  }

  const handleSelectCategoryCounts = async () => {
    categoryCounts.value = await fetchCategoryCounts()
  }

  /** 목록 페이지 진입 시 필요한 데이터를 한 번에 채운다. */
  const handleSelectProjectPage = async (category: CategoryFilter) => {
    activeCategory.value = category
    await Promise.all([handleSelectProjectList(), handleSelectCategoryCounts()])
  }

  // ===== 이벤트 =====
  const onCategoryChange = async (category: CategoryFilter) => {
    activeCategory.value = category
    await handleSelectProjectList()
  }

  return {
    projectList,
    selectedProject,
    activeCategory,
    categoryCounts,
    handleSelectProjectList,
    handleSelectProject,
    handleSelectCategoryCounts,
    handleSelectProjectPage,
    onCategoryChange,
  }
}

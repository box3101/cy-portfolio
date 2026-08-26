import type { Profile, Career, CareerProject, Skill } from '~/types/database'

export const useProfileStore = () => {
  const { fetchProfile, fetchCareerList, fetchCareerProjectList, fetchSkillList } = useProfileApi()

  // ===== 상태 변수 =====
  const profile = useState<Profile | null>('profile/data', () => null)
  const careerList = useState<Career[]>('profile/careers', () => [])
  const careerProjectList = useState<CareerProject[]>('profile/careerProjects', () => [])
  const skillList = useState<Skill[]>('profile/skills', () => [])

  // ===== 조회 =====
  const handleSelectProfile = async () => {
    profile.value = await fetchProfile()
  }

  /** 소개 페이지 진입 시 필요한 데이터를 한 번에 채운다. */
  const handleSelectAbout = async () => {
    const [p, c, cp, s] = await Promise.all([
      fetchProfile(),
      fetchCareerList(),
      fetchCareerProjectList(),
      fetchSkillList(),
    ])
    profile.value = p
    careerList.value = c ?? []
    careerProjectList.value = cp ?? []
    skillList.value = s ?? []
  }

  // ===== 파생 =====
  /*
    회사에 프로젝트를 붙여 화면이 쓰기 좋은 모양으로 만든다.
    컴포넌트에서 매번 filter 를 돌리면 경력 수 × 프로젝트 수만큼
    반복되므로 여기서 한 번만 묶는다.
  */
  const careerWithProjects = computed(() =>
    careerList.value.map((c) => ({
      ...c,
      projects: careerProjectList.value.filter((p) => p.career_id === c.id),
    })),
  )

  return {
    profile,
    careerList,
    careerProjectList,
    careerWithProjects,
    skillList,
    handleSelectProfile,
    handleSelectAbout,
  }
}

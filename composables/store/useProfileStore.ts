import type { Profile, Career, Skill } from '~/types/database'

export const useProfileStore = () => {
  const { fetchProfile, fetchCareerList, fetchSkillList } = useProfileApi()

  // ===== 상태 변수 =====
  const profile = useState<Profile | null>('profile/data', () => null)
  const careerList = useState<Career[]>('profile/careers', () => [])
  const skillList = useState<Skill[]>('profile/skills', () => [])

  // ===== 조회 =====
  const handleSelectProfile = async () => {
    profile.value = await fetchProfile()
  }

  /** 소개 페이지 진입 시 필요한 데이터를 한 번에 채운다. */
  const handleSelectAbout = async () => {
    const [p, c, s] = await Promise.all([fetchProfile(), fetchCareerList(), fetchSkillList()])
    profile.value = p
    careerList.value = c ?? []
    skillList.value = s ?? []
  }

  return { profile, careerList, skillList, handleSelectProfile, handleSelectAbout }
}

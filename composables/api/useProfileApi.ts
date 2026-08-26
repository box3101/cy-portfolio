import type { Profile, Career, Skill } from '~/types/database'

export const useProfileApi = () => {
  const { client, runQuery } = useSupabase()

  // ===== Profile =====
  /** 단일 row (id = 1 고정) */
  const fetchProfile = () =>
    runQuery<Profile>('프로필 조회', client.from('profile').select('*').eq('id', 1).maybeSingle())

  // ===== Career =====
  const fetchCareerList = () =>
    runQuery<Career[]>(
      '경력 조회',
      client.from('careers').select('*').order('sort_order', { ascending: true }),
    )

  // ===== Skill =====
  const fetchSkillList = () =>
    runQuery<Skill[]>(
      '스킬 조회',
      client.from('skills').select('*').order('sort_order', { ascending: true }),
    )

  return { fetchProfile, fetchCareerList, fetchSkillList }
}

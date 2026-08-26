import type { Profile, Career, Skill } from '~/types/database'

export const useProfileApi = () => {
  const { runQuery } = useSupabase()

  // ===== Profile =====
  /** 단일 row (id = 1 고정) */
  const fetchProfile = () =>
    runQuery<Profile>('프로필 조회', (c) =>
      c.from('profile').select('*').eq('id', 1).maybeSingle(),
    )

  // ===== Career =====
  const fetchCareerList = () =>
    runQuery<Career[]>('경력 조회', (c) =>
      c.from('careers').select('*').order('sort_order', { ascending: true }),
    )

  // ===== Skill =====
  const fetchSkillList = () =>
    runQuery<Skill[]>('스킬 조회', (c) =>
      c.from('skills').select('*').order('sort_order', { ascending: true }),
    )

  return { fetchProfile, fetchCareerList, fetchSkillList }
}

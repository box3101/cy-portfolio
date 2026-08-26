import type { Profile, Career, CareerProject, Skill } from '~/types/database'

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

  /*
    경력과 따로 받아 스토어에서 합친다.
    중첩 select(careers(*, career_projects(*)))를 쓰면 한 번에 오지만,
    RLS 정책이 두 테이블에 각각 걸려 있어 한쪽이 막히면 전체가 빈다.
    따로 받으면 프로젝트만 실패해도 경력 목록은 살아남는다.
  */
  const fetchCareerProjectList = () =>
    runQuery<CareerProject[]>('경력 프로젝트 조회', (c) =>
      c.from('career_projects').select('*').order('sort_order', { ascending: true }),
    )

  // ===== Skill =====
  const fetchSkillList = () =>
    runQuery<Skill[]>('스킬 조회', (c) =>
      c.from('skills').select('*').order('sort_order', { ascending: true }),
    )

  return { fetchProfile, fetchCareerList, fetchCareerProjectList, fetchSkillList }
}

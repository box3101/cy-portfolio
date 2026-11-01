import { describe, it, expect } from 'vitest'
import { TEST_BASE_URL } from './config'

async function fetchHtml(path: string): Promise<string> {
  const res = await fetch(`${TEST_BASE_URL}${path}`)
  expect(res.status, `${path} 가 200이 아닙니다`).toBe(200)
  return res.text()
}

describe('Supabase 연동', () => {
  it('소개 페이지가 DB의 경력·스킬을 서버에서 렌더한다', async () => {
    const html = await fetchHtml('/about')

    // 클라이언트에서만 채우면 이 문자열들이 HTML에 없다 = SEO 불가
    expect(html).toContain('이즈파크 AX Group') // careers
    expect(html).toContain('Vue 3') // skills
    expect(html).toContain('디자인 시스템을 만들고') // profile.headline
  })

  it('연락처 페이지가 DB의 프로필을 서버에서 렌더한다', async () => {
    const html = await fetchHtml('/contact')
    expect(html).toContain('github.com/box3101')
  })

  it('홈 히어로가 서버에서 렌더된다', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('studio-main')
    expect(html).toContain('/images/studio-courtyard.webp')
    expect(html).toContain('href="https://github.com/box3101/ispark-ui"')
    expect(html).toContain('href="/agents"')
    expect(html).toContain('href="/projects?space=si"')
  })

  it('공개된 프로젝트 목록을 서버에서 렌더한다', async () => {
    const html = await fetchHtml('/projects')
    expect(html).toContain('href="/work/taskflow"')
    expect(html).toContain('href="/projects/sgate-okr-solution"')
    expect(html).not.toContain('프로젝트를 불러오지 못했습니다')
  })

  it('이야기 상세에 직접 접근하면 선택한 구현 과정이 렌더된다', async () => {
    const html = await fetchHtml('/work/team-agent?tab=process')
    expect(html).toContain('관리 기능 연결')
    expect(html).toContain('드래그 순서 변경')
    const missing = await fetch(`${TEST_BASE_URL}/work/not-a-story`)
    expect(missing.status).toBe(404)
  })

  it('존재하지 않는 프로젝트는 404를 반환한다', async () => {
    const res = await fetch(`${TEST_BASE_URL}/projects/존재하지-않는-slug`)
    expect(res.status).toBe(404)
  })
})

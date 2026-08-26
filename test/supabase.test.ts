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
    expect(html).toContain("Cy's Code Canvas")
    expect(html).toContain('/video/main.mp4')

    // 태그라인 문구는 DB가 아니라 마크업에 박힌 카피라 자주 바뀐다.
    // 문구 자체를 단언하면 카피를 고칠 때마다 테스트가 깨지므로,
    // 히어로가 서버에서 그려졌음을 증명하는 구조만 확인한다.
    expect(html).toContain('hero__script')
    expect(html).toContain('href="/projects"')
  })

  it('미공개 프로젝트는 목록에 노출되지 않는다', async () => {
    const html = await fetchHtml('/projects')
    // seed는 전부 is_published=false 이므로 RLS가 막아야 한다
    expect(html).toContain('아직 공개된 프로젝트가 없습니다')
  })

  it('존재하지 않는 프로젝트는 404를 반환한다', async () => {
    const res = await fetch(`${TEST_BASE_URL}/projects/존재하지-않는-slug`)
    expect(res.status).toBe(404)
  })
})

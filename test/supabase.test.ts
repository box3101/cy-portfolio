import { describe, it, expect } from 'vitest'
import { TEST_BASE_URL } from './config'

describe('Supabase 연동', () => {
  it('홈에서 프로필 이름이 서버 렌더된다', async () => {
    const res = await fetch(`${TEST_BASE_URL}/`)
    expect(res.status, '/ 가 200이 아닙니다').toBe(200)

    const html = await res.text()
    // 서버에서 Supabase를 읽어 HTML에 실어 보냈는지 확인한다.
    // 클라이언트에서만 채우면 이 문자열이 없다.
    expect(html).toContain('이찬용')
  })
})

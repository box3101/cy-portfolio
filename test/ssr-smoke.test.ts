import { describe, it, expect } from 'vitest'
import { TEST_BASE_URL } from './config'

/** 프로덕션 서버에서 페이지 HTML을 가져온다. */
async function fetchHtml(path: string): Promise<string> {
  const res = await fetch(`${TEST_BASE_URL}${path}`)
  expect(res.status, `${path} 가 200이 아닙니다`).toBe(200)
  return res.text()
}

describe('ispark-ui SSR 스모크', () => {
  it('Form 그룹이 서버에서 렌더링된다', async () => {
    const html = await fetchHtml('/smoke/form')

    // 페이지 자체가 렌더됐는지
    expect(html).toContain('data-smoke="form"')

    // 각 컴포넌트가 서버 HTML에 실제 텍스트를 남겼는지
    // (SSR 실패 시 빈 껍데기만 남으므로 이 문자열들이 사라진다)
    expect(html).toContain('저장하기')   // UiButton 슬롯
    expect(html).toContain('이메일 주소') // UiInput label
    expect(html).toContain('자기소개')    // UiTextarea label
    expect(html).toContain('공개 여부')   // UiToggle label
    expect(html).toContain('약관 동의')   // UiCheckbox label
    expect(html).toContain('연락 방법')   // UiRadio label
  })
})

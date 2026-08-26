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

  it('Display 그룹이 서버에서 렌더링된다', async () => {
    const html = await fetchHtml('/smoke/display')
    expect(html).toContain('data-smoke="display"')
    expect(html).toContain('진행중')      // UiBadge
    expect(html).toContain('이찬용')      // UiAvatar
    expect(html).toContain('프로젝트명')   // UiTable 헤더
    expect(html).toContain('경력 사항')    // UiAccordion 제목
    expect(html).toContain('120')         // UiPagination totalCount
    expect(html).toContain('진행률')      // UiProgress label (npm 0.6.12부터 사용 가능)
  })

  it('Overlay 그룹이 서버에서 렌더링된다', async () => {
    const html = await fetchHtml('/smoke/overlay')
    expect(html).toContain('data-smoke="overlay"')
    expect(html).toContain('모달 열기')   // UiModal 트리거(UiButton 슬롯)
    expect(html).toContain('메뉴 열기')   // UiDropdownMenu 트리거
    expect(html).toContain('서랍 열기')   // UiDrawer 트리거
    expect(html).toContain('도움말')      // UiTooltip 트리거
    // 4개 섹션이 모두 살아남았는지 = SSR 중 죽은 컴포넌트가 없다
    expect(html.match(/data-c="Ui/g)?.length).toBe(4)
  })

  it('Feedback 그룹이 서버에서 렌더링된다', async () => {
    const html = await fetchHtml('/smoke/feedback')
    expect(html).toContain('data-smoke="feedback"')
    expect(html).toContain('토스트 띄우기') // openToast 트리거
    expect(html).toContain('삭제 확인')     // openConfirm 트리거
    expect(html.match(/data-c="Ui/g)?.length).toBe(4)
  })

  it('Data 그룹이 서버에서 렌더링된다', async () => {
    const html = await fetchHtml('/smoke/data')
    expect(html).toContain('data-smoke="data"')
    expect(html).toContain('첨부 파일')   // UiFileList 섹션
    expect(html).toContain('파일 업로드') // UiFileUpload 섹션
    expect(html).toContain('방문 통계')   // UiChart 섹션
    expect(html).toContain('상세 내용')   // UiMarkdownEditor 섹션
    expect(html.match(/data-c="Ui/g)?.length).toBe(10)
  })
})

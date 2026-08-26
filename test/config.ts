// test/config.ts
// 테스트 서버 접속 정보. globalSetup과 각 테스트가 공유한다.

export const TEST_PORT = 3199
export const TEST_BASE_URL = `http://127.0.0.1:${TEST_PORT}`

/** 스모크 대상 경로. SSR 테스트와 하이드레이션 테스트가 같은 목록을 쓴다. */
export const SMOKE_PATHS = [
  '/smoke/form',
  '/smoke/display',
  '/smoke/overlay',
  '/smoke/feedback',
  '/smoke/data',
] as const

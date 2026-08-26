// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./test/setup/server.ts'],
    testTimeout: 60_000,
    hookTimeout: 300_000, // globalSetup에서 nuxt build를 돌린다
    // 하나의 서버를 공유하므로 파일 간 병렬 실행을 끈다
    fileParallelism: false,
  },
})

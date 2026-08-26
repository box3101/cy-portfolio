// test/setup/server.ts
// vitest globalSetup — 프로덕션 빌드를 만들고 Nitro 서버를 띄운다.
//
// @nuxt/test-utils의 인프로세스 빌드를 쓰지 않는 이유:
// vitest 프로세스 안에서 Rollup 빌드를 돌리면 @vue/compiler-sfc(CJS)가
// magic-string을 잘못 해석해 "MagicString is not a constructor"로 죽는다.
// 자식 프로세스에서 정상 빌드한 뒤 그 산출물을 테스트하면 이 문제가 없고,
// 실제 배포되는 프로덕션 SSR 출력을 검증하게 되므로 더 정확하다.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { TEST_PORT, TEST_BASE_URL } from '../config'

let server: ChildProcess | undefined

/** 서버가 응답할 때까지 기다린다. */
async function waitForServer(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(TEST_BASE_URL, { signal: AbortSignal.timeout(2000) })
      if (res.status > 0) return
    } catch {
      // 아직 안 떴다. 재시도한다.
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`테스트 서버가 ${timeoutMs}ms 안에 뜨지 않았습니다: ${TEST_BASE_URL}`)
}

export async function setup(): Promise<void> {
  // SKIP_BUILD=1 이면 기존 .output을 재사용한다 (테스트 반복 시 시간 절약)
  if (process.env.SKIP_BUILD !== '1') {
    const built = spawnSync('npx', ['nuxt', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NUXT_IGNORE_LOCK: '1' },
    })
    if (built.status !== 0) {
      throw new Error(`nuxt build 실패 (exit ${built.status})`)
    }
  }

  server = spawn(process.execPath, ['.output/server/index.mjs'], {
    env: { ...process.env, PORT: String(TEST_PORT), NITRO_PORT: String(TEST_PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  server.stderr?.on('data', (chunk) => {
    process.stderr.write(`[test-server] ${chunk}`)
  })

  await waitForServer()
}

export async function teardown(): Promise<void> {
  if (!server) return
  server.kill('SIGTERM')
  // 프로세스가 정리될 시간을 준다
  await new Promise((r) => setTimeout(r, 300))
  if (!server.killed) server.kill('SIGKILL')
}

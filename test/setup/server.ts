// test/setup/server.ts
// vitest globalSetup — 프로덕션 빌드를 만들고 Nitro 서버를 띄운다.
//
// @nuxt/test-utils의 인프로세스 빌드를 쓰지 않는 이유:
// vitest 프로세스 안에서 Rollup 빌드를 돌리면 @vue/compiler-sfc(CJS)가
// magic-string을 잘못 해석해 "MagicString is not a constructor"로 죽는다.
// 자식 프로세스에서 정상 빌드한 뒤 그 산출물을 테스트하면 이 문제가 없고,
// 실제 배포되는 프로덕션 SSR 출력을 검증하게 되므로 더 정확하다.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'
import { TEST_PORT, TEST_BASE_URL } from '../config'

let server: ChildProcess | undefined

/**
 * .env 를 읽어 객체로 만든다.
 *
 * nuxi(dev/build)는 .env 를 알아서 읽지만, 빌드 산출물인 Nitro 서버를
 * `node .output/server/index.mjs` 로 직접 띄우면 프로세스 환경변수만 본다.
 * 그래서 여기서 명시적으로 주입한다. (Vercel에서는 대시보드 환경변수가 이 역할을 한다)
 */
function loadEnvFile(): Record<string, string> {
  if (!fs.existsSync('.env')) return {}

  const out: Record<string, string> = {}
  for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq < 0) continue

    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    out[key] = value
  }
  return out
}

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

/** 포트가 비어 있는지 확인한다. */
async function isPortFree(): Promise<boolean> {
  try {
    await fetch(TEST_BASE_URL, { signal: AbortSignal.timeout(700) })
    return false // 응답이 온다 = 누군가 쓰고 있다
  } catch {
    return true
  }
}

async function waitPortFree(timeoutMs = 10_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (await isPortFree()) return true
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
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

  const fileEnv = loadEnvFile()
  if (!fileEnv.NUXT_PUBLIC_SUPABASE_URL && !process.env.NUXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Supabase 환경변수가 없습니다. .env 를 만들고 NUXT_PUBLIC_SUPABASE_* 를 채우세요.')
  }

  // 이전 실행의 서버가 남아 있으면 새 서버는 EADDRINUSE로 죽고,
  // 테스트는 조용히 구버전 서버를 때린다. 그 상태의 실패는 원인 추적이 매우 어렵다.
  if (!(await isPortFree())) {
    throw new Error(
      `포트 ${TEST_PORT}가 이미 사용 중입니다. 이전 테스트 서버가 남아 있을 수 있습니다.\n` +
        `  종료: npx kill-port ${TEST_PORT}\n` +
        `  또는: Get-NetTCPConnection -LocalPort ${TEST_PORT} -State Listen | ` +
        `Select -Expand OwningProcess | ForEach { Stop-Process -Id $_ -Force }`,
    )
  }

  server = spawn(process.execPath, ['.output/server/index.mjs'], {
    env: {
      ...process.env,
      ...fileEnv,
      PORT: String(TEST_PORT),
      NITRO_PORT: String(TEST_PORT),
    },
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

  // Windows에서는 SIGTERM이 즉시 반영되지 않는다.
  // 포트가 실제로 풀릴 때까지 확인하고, 안 풀리면 강제 종료한다.
  if (!(await waitPortFree(4000))) {
    server.kill('SIGKILL')
    if (server.pid && process.platform === 'win32') {
      // SIGKILL도 안 먹는 경우가 있어 taskkill로 프로세스 트리를 정리한다.
      spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
    }
    await waitPortFree(4000)
  }

  server = undefined
}

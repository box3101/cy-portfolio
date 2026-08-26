import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium, type Browser } from 'playwright'
import { TEST_BASE_URL, SMOKE_PATHS } from './config'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
}, 120_000)

afterAll(async () => {
  await browser?.close()
})

describe('ispark-ui 하이드레이션', () => {
  for (const path of SMOKE_PATHS) {
    it(`${path} 에서 콘솔 오류가 없다`, async () => {
      const problems: string[] = []

      const page = await browser.newPage()

      page.on('console', (msg) => {
        const text = msg.text()
        // hydration mismatch는 error가 아니라 warning으로 나오므로 함께 수집한다
        if (msg.type() === 'error' || /hydrat/i.test(text)) {
          problems.push(`[${msg.type()}] ${text}`)
        }
      })
      page.on('pageerror', (err) => {
        problems.push(`[pageerror] ${err.message}`)
      })

      await page.goto(`${TEST_BASE_URL}${path}`, { waitUntil: 'networkidle' })
      await page.close()

      expect(problems, `\n${path}\n${problems.join('\n')}`).toEqual([])
    })
  }
})

import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.STUDIO_BASE_URL || 'http://127.0.0.1:3020'
await mkdir('artifacts/studio-study', { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
console.log('Browser started')
const page = await browser.newPage({ viewport: { width: 1536, height: 578 } })
page.setDefaultNavigationTimeout(60000)
const errors = []
page.on('pageerror', error => errors.push(error.message))
try {
  await page.goto(`${base}${process.env.STUDIO_PATH || '/studio-study'}`, { waitUntil: 'domcontentloaded' })
  console.log('Page loaded')
  await page.locator('[data-render-state="ready"]').waitFor()
  console.log('3D ready')
  if (process.env.STUDIO_PATH === '/') {
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index,follow')
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://cy-portfolio-eight.vercel.app/')
    assert.equal(await page.locator('.review-label').count(), 0)
    assert.equal(await page.locator('.studio-header nav a').count(), 4)
    assert((await page.title()).includes('이찬용'))
  }
  assert.equal(await page.locator('.panel-dom article').count(), 3)
  const panels = await page.locator('.panel-dom article').evaluateAll(elements => elements.map(element => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { label: element.getAttribute('aria-label'), x, y, width, height }
  }))
  await page.keyboard.press('Tab')
  assert.equal(await page.locator(':focus').getAttribute('href'), '#studio-main')
  const dots = page.locator('.slide-dots button')
  await page.getByRole('button', { name: '다음 프로젝트', exact: true }).click()
  assert.equal(await dots.nth(1).getAttribute('aria-current'), 'true')
  assert(await page.locator('.design-art').evaluate(el => el.classList.contains('is-featured')))
  await page.getByRole('button', { name: '다음 프로젝트', exact: true }).click()
  assert.equal(await dots.nth(2).getAttribute('aria-current'), 'true')
  await page.getByRole('button', { name: '다음 프로젝트', exact: true }).click()
  assert.equal(await dots.nth(0).getAttribute('aria-current'), 'true')
  await page.getByRole('button', { name: '이전 프로젝트', exact: true }).click()
  assert.equal(await dots.nth(2).getAttribute('aria-current'), 'true')
  await dots.nth(1).click()
  await page.keyboard.press('ArrowLeft')
  assert.equal(await dots.nth(0).getAttribute('aria-current'), 'true')
  await page.locator('.cta').focus()
  await page.keyboard.press('Enter')
  await page.waitForURL('**/work/proposal-agent')
  await page.locator('.story-heading').waitFor()
  console.log('CTA navigation passed')
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await page.locator('[data-render-state="ready"]').waitFor()
  await page.locator('[data-render-state="ready"] canvas').waitFor()
  assert.equal(await page.locator('.story-world canvas').count(), 1)
  assert.equal(await page.locator('.panel-dom article').count(), 3)

  // Simulate a real GPU context loss: HTML UI and navigation must survive.
  await page.locator('.story-world canvas').evaluate(canvas => {
    const gl = canvas.getContext('webgl2')
    gl.getExtension('WEBGL_lose_context').loseContext()
  })
  await page.locator('[data-render-state="fallback"]').waitFor()
  console.log('GPU fallback passed')
  assert.equal(await page.locator('.artwork-source article:visible').count(), 3)
  assert.equal(await page.locator('.cta').isVisible(), true)
  await page.screenshot({ path: 'artifacts/studio-study/fallback.png' })
  assert.deepEqual(errors, [])
  const result = { passed: true, panels, checks: ['3 HTML panels', 'keyboard skip link', 'next/previous wraparound', 'indicator selection', 'keyboard slide selection', 'CTA navigation', 'route return without duplicate canvas', 'WebGL context loss fallback', 'no uncaught browser errors'], errors }
  await writeFile('artifacts/studio-study/checks.json', JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const name = process.argv[2] || 'desktop'
const width = Number(process.argv[3] || 1536)
const height = Number(process.argv[4] || 864)
const output = new URL('../artifacts/studio-study/', import.meta.url)
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
const response = await page.goto(`${process.env.STUDIO_BASE_URL || 'http://127.0.0.1:3020'}/studio-study`, { waitUntil: 'domcontentloaded', timeout: 60000 })
console.log('HTTP', response.status())
if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`)
await page.locator('.story-world[data-render-state="ready"], .story-world[data-render-state="fallback"]').waitFor().catch(async error => {
  console.log('Render failure:', errors, await page.locator('body').innerText())
  await page.screenshot({ path: new URL('failure.png', output).pathname.replace(/^\/(\w:)/, '$1') })
  throw error
})
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(2500)
await page.locator('vite-error-overlay, vite-plugin-checker-error-overlay').waitFor({ state: 'hidden' })
await page.screenshot({ path: new URL(`${name}.png`, output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true })
const result = await page.evaluate(() => ({
  title: document.title,
  viewport: { width: innerWidth, height: innerHeight },
  overflow: document.documentElement.scrollWidth > innerWidth,
  canvas: [...document.querySelectorAll('canvas')].map(el => ({ width: el.width, height: el.height })),
  heading: document.querySelector('h1')?.textContent,
  links: [...document.querySelectorAll('main a')].map(el => ({ text: el.textContent?.trim(), href: el.getAttribute('href') })),
}))
await writeFile(new URL(`${name}.json`, output), JSON.stringify({ ...result, errors }, null, 2))
console.log(JSON.stringify({ ...result, errors }, null, 2))
await browser.close()

import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.STUDIO_BASE_URL || 'http://127.0.0.1:3020'
await mkdir('artifacts/studio-study', { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 578 } })
  // The study must remain legible even if external font CDNs cannot be reached.
  await page.route(/https:\/\/(fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net)\//, route => route.abort())
  await page.goto(`${base}${process.env.STUDIO_PATH || '/studio-study'}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('[data-render-state="ready"]').waitFor()
  await page.evaluate(() => document.fonts.ready)
  const result = await page.evaluate(() => ({
    sansLoaded: document.fonts.check('400 12px "Studio Noto Sans"', '좋은 제안이'),
    panels: [...document.querySelectorAll('.panel-dom article')].map(element => ({
      transform: getComputedStyle(element).transform,
      fontFamily: getComputedStyle(element).fontFamily,
    })),
    invalidCharacters: document.querySelector('main').textContent.includes('\uFFFD'),
  }))
  assert(result.sansLoaded)
  assert(!result.invalidCharacters)
  assert.equal(result.panels.length, 3)
  assert(result.panels.every(panel => panel.transform === 'none'))
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable')
  const { root } = await cdp.send('DOM.getDocument')
  const fonts = {}
  for (const selector of ['h1', '.proposal-heading p', '.prompt-preview > span', '.mini-menu span']) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
    fonts[selector] = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts
    assert(fonts[selector].some(font => font.isCustomFont && font.glyphCount > 0))
  }
  await writeFile('artifacts/studio-study/font-check.json', JSON.stringify({ ...result, fonts, externalFontCDNs: 'blocked during test' }, null, 2))
  console.log(JSON.stringify({ ...result, fonts }, null, 2))
} finally { await browser.close() }

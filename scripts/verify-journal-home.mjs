import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.JOURNAL_BASE_URL || 'http://[::1]:3000'
await mkdir('artifacts/journal-home', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1672, height: 941 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
async function home() {
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt?.isHydrating === false)
  await page.waitForFunction(() => document.querySelector('.cover-art')?.complete)
}
try {
  await home()
  assert.ok(await page.locator('.cover-art').evaluate(el => el.naturalWidth > 0))
  await page.screenshot({ path: 'artifacts/journal-home/exact-desktop.png' })
  for (const [width, height] of [[1872, 877], [1920, 1080], [1024, 768]]) {
    await page.setViewportSize({ width, height })
    await page.mouse.move(width - 30, height / 2)
    await page.waitForTimeout(1000)
    const bounds = await page.locator('.cover-scene').boundingBox()
    assert.ok(bounds.x <= 0 && bounds.y <= 0 && bounds.x + bounds.width >= width && bounds.y + bounds.height >= height, `Full bleed ${width}x${height}`)
    assert.notEqual(await page.locator('.cover-scene').evaluate(el => el.style.getPropertyValue('--view-x')), '0px')
    if (width === 1872) await page.screenshot({ path: 'artifacts/journal-home/full-bleed-desktop.png' })
  }
  await page.setViewportSize({ width: 1672, height: 941 })
  await page.mouse.move(1672 * .51, 941 * .5)
  await page.waitForTimeout(500)
  assert.equal(await page.locator('.article-link').nth(1).evaluate(el => getComputedStyle(el, '::before').opacity), '1')
  console.log('PASS full bleed, pointer motion and article lighting')
  const routes = ['/projects/ispark-ui', '/work/proposal-agent', '/projects']
  for (let i = 0; i < 3; i++) {
    await home()
    const box = await page.locator('.cover-scene').boundingBox()
    await page.mouse.click(box.x + box.width * [.16, .51, .84][i], box.y + box.height * .5)
    await page.waitForURL(`**${routes[i]}`)
    await page.waitForFunction(() => !document.querySelector('.journal-cover'))
    console.log('PASS article click', routes[i])
  }
  await home()
  await page.locator('.article-link').nth(0).focus()
  await page.keyboard.press('Enter')
  await page.waitForURL('**/projects/ispark-ui')
  await home()
  await page.locator('.cover-menu summary').click()
  assert.equal(await page.locator('.cover-menu nav a:visible').count(), 4)
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('.cover-menu').evaluate(el => el.open), false)
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await home()
    for (let i = 0; i < 3; i++) {
      await page.locator('.mobile-sections button').nth(i).click()
      await page.waitForTimeout(700)
      assert.equal(await page.locator('.mobile-sections button').nth(i).getAttribute('aria-pressed'), 'true')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      const box = await page.locator('.cover-scene').boundingBox()
      const centerX = box.x + box.width * [.16, .51, .84][i]
      assert.ok(centerX >= 0 && centerX <= width)
    }
    await page.locator('.mobile-sections button').nth(1).click()
    await page.waitForTimeout(700)
    await page.screenshot({ path: `artifacts/journal-home/exact-mobile-${width}.png` })
    await page.mouse.click(width / 2, 400)
    await page.waitForURL('**/work/proposal-agent')
    console.log('PASS mobile pan and article navigation', width)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await home()
  assert.ok(await page.locator('.cover-scene').evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) < .001))
  await page.setViewportSize({ width: 1872, height: 877 })
  await page.mouse.move(1750, 300)
  assert.equal(await page.locator('.cover-scene').evaluate(el => getComputedStyle(el).transform), 'none')
  await page.route('**/images/journal-home/newspaper-ai-builder.webp', route => route.abort())
  await home()
  await page.locator('.cover-fallback').waitFor()
  assert.equal(await page.locator('.cover-fallback a').count(), 3)
  assert.equal(errors.length, 0, errors.join('\n'))
  console.log('PASS keyboard, menu, reduced motion and image fallback')
} finally { await browser.close() }

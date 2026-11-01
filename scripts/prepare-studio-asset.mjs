import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'

// Lossy encoding only: no retouching or screenshot compositing.
const source = await readFile(process.argv[2])
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const page = await browser.newPage()
const encoded = await page.evaluate(async data => {
  const image = new Image()
  image.src = `data:image/png;base64,${data}`
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  canvas.getContext('2d').drawImage(image, 0, 0)
  return canvas.toDataURL('image/webp', .94).split(',')[1]
}, source.toString('base64'))
await writeFile(process.argv[3], Buffer.from(encoded, 'base64'))
await browser.close()

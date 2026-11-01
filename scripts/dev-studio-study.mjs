import { loadNuxt, buildNuxt, writeTypes } from '@nuxt/kit'
import { listen } from 'listhen'
import { toNodeListener } from 'h3'
import { resolve } from 'node:path'

// Independent build output avoids collisions with another local Nuxt session.
const nuxt = await loadNuxt({ cwd: process.cwd(), dev: true, overrides: {
  buildDir: resolve('node_modules/.cache/studio-study'),
  devtools: { enabled: false },
  // Run vue-tsc separately: unrelated in-progress pages must not cover this visual review.
  typescript: { typeCheck: false },
  vite: { server: { hmr: { port: 24681 } } },
  devServer: { host: '127.0.0.1', port: 3020, url: 'http://127.0.0.1:3020' },
} })
await writeTypes(nuxt)
await buildNuxt(nuxt)
const listener = await listen(nuxt.server.handler || toNodeListener(nuxt.server.app), { port: 3020, hostname: '127.0.0.1', showURL: true })
await nuxt.callHook('listen', listener.server, listener)
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => {
  await listener.close(); await nuxt.close(); process.exit(0)
})

import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

/**
 * sitemap.xml — 정적 페이지 + 공개된 프로젝트 상세를 나열한다.
 *
 * @nuxtjs/sitemap 모듈을 쓰지 않는 이유:
 *   프로젝트 목록이 Supabase에 있어 어차피 쿼리가 필요하고,
 *   그 한 번의 쿼리를 위해 의존성을 늘릴 이유가 없다.
 *
 * `composables/useSupabase`는 앱(Vue) 스코프 자동 임포트라 Nitro 서버 라우트에서
 * 쓸 수 없다. 여기서는 클라이언트를 직접 만든다.
 */

/** 라우트가 실제로 존재하는 정적 페이지만 넣는다. */
const STATIC_PATHS = ['/', '/projects', '/archive', '/about', '/contact']

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const urlEntry = (loc: string, lastmod?: string) =>
  lastmod
    ? `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`
    : `  <url><loc>${escapeXml(loc)}</loc></url>`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.public.siteUrl).replace(/\/$/, '')

  const entries = STATIC_PATHS.map((p) => urlEntry(`${base}${p}`))

  // DB 조회가 실패해도 사이트맵 자체는 정적 경로로 응답한다.
  // 여기서 500을 내면 크롤러가 사이트맵 전체를 못 읽는다.
  const url = String(config.public.supabaseUrl)
  const key = String(config.public.supabaseAnonKey)

  if (url && key) {
    try {
      const client = createClient<Database>(url, key, { auth: { persistSession: false } })
      const { data, error } = await client
        .from('projects')
        .select('slug, updated_at')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      for (const p of data ?? []) {
        entries.push(urlEntry(`${base}/projects/${p.slug}`, p.updated_at?.slice(0, 10)))
      }
    } catch (e) {
      console.error('[sitemap] 프로젝트 조회 실패 — 정적 경로만 내보냅니다.', e)
    }
  }

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`
})

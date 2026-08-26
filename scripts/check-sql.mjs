// Supabase 마이그레이션·seed를 PGlite(WASM Postgres)에서 실제로 실행해 검증한다.
// Docker 없이 돌릴 수 있고, 대시보드에 붙여넣기 전에 문법·제약조건 오류를 잡는다.
import { PGlite } from '@electric-sql/pglite'
import fs from 'node:fs'

import { fileURLToPath } from 'node:url'
import path from 'node:path'

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../supabase')
const read = (p) => fs.readFileSync(`${DIR}/${p}`, 'utf8')

const db = new PGlite()

const step = async (label, sql) => {
  try {
    await db.exec(sql)
    console.log(`✅ ${label}`)
  } catch (e) {
    console.log(`❌ ${label}\n   ${e.message}`)
    process.exitCode = 1
    throw e
  }
}

// Supabase의 anon / authenticated 역할은 플레인 Postgres에 없다. RLS 정책 검증을 위해 만든다.
await step('사전: anon/authenticated 역할 생성', `
  create role anon;
  create role authenticated;
`)

await step('0001_init.sql', read('migrations/0001_init.sql'))
await step('0002_rls.sql', read('migrations/0002_rls.sql'))
await step('seed.sql (1회차)', read('seed.sql'))
await step('seed.sql (2회차 — 멱등성 확인)', read('seed.sql'))

// ===== 검증 =====
console.log('\n--- 적재 결과 ---')
const counts = await db.query(`
  select
    (select count(*) from public.projects)   as projects,
    (select count(*) from public.careers)    as careers,
    (select count(*) from public.skills)     as skills,
    (select count(*) from public.profile)    as profile,
    (select count(*) from public.archives)   as archives,
    (select count(*) from public.page_views) as page_views
`)
console.log(counts.rows[0])

console.log('\n--- RLS 활성 여부 ---')
const rls = await db.query(`
  select tablename, rowsecurity
  from pg_tables where schemaname = 'public'
  order by tablename
`)
rls.rows.forEach((r) => console.log(`  ${r.rowsecurity ? '✅' : '❌'} ${r.tablename}`))

console.log('\n--- 정책 수 ---')
const pol = await db.query(`
  select tablename, count(*)::int as n
  from pg_policies where schemaname = 'public'
  group by tablename order by tablename
`)
pol.rows.forEach((r) => console.log(`  ${r.tablename}: ${r.n}`))

console.log('\n--- 트리거 동작 (updated_at) ---')
await db.exec(`update public.projects set title = title where slug = 'ispark-ui'`)
const t = await db.query(`
  select (updated_at > created_at) as bumped from public.projects where slug = 'ispark-ui'
`)
console.log(`  updated_at 갱신됨: ${t.rows[0].bumped ? '✅' : '❌'}`)

console.log('\n--- 제약조건 검증 (잘못된 값은 거부되어야 함) ---')
const mustFail = [
  ["category 오타", `insert into public.projects (slug,title,category,period_start) values ('x','x','vue','2025-01-01')`],
  ["level 범위 초과", `insert into public.skills (name,category,level) values ('X','tool',9)`],
  ["profile 2번째 row", `insert into public.profile (id,name) values (2,'다른사람')`],
  ["doc_type 오타", `insert into public.archives (title,doc_type,file_path) values ('x','인증서','/a.pdf')`],
]
for (const [label, sql] of mustFail) {
  try {
    await db.exec(sql)
    console.log(`  ❌ ${label} — 거부되어야 하는데 통과됨`)
    process.exitCode = 1
  } catch {
    console.log(`  ✅ ${label} — 정상 거부`)
  }
}

console.log('\n--- 진행중 판정 (period_end IS NULL) ---')
const ongoing = await db.query(`
  select count(*)::int as n from public.projects where period_end is null
`)
console.log(`  진행중 프로젝트: ${ongoing.rows[0].n}건`)

console.log('\n--- tags 배열 GIN 검색 ---')
const tagged = await db.query(`
  select slug from public.projects where tags @> array['Vue3'] order by sort_order
`)
console.log(`  Vue3 태그: ${tagged.rows.map((r) => r.slug).join(', ')}`)

await db.close()
console.log(process.exitCode ? '\n실패 항목 있음' : '\n전체 통과')

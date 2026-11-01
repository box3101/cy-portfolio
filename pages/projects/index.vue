<script setup lang="ts">
import { UiInput, UiEmpty, UiButton, UiTab } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
import { siSlugs, workStories } from '~/data/workStories'
const route = useRoute()
const router = useRouter()
const { projectList, projectLoadFailed, handleSelectProjectPage } = useProjectStore()
await useAsyncData('projects/list', async () => { await handleSelectProjectPage('all'); return true }, { getCachedData: () => undefined })
const keyword = ref('')
const isSi = computed(() => route.query.space === 'si')
const category = computed(() => ['vue-nuxt','astro','react','publisher'].includes(String(route.query.category)) ? String(route.query.category) : 'all')
const scopedProjects = computed(() => projectList.value.filter(p => !isSi.value || siSlugs.has(p.slug)))
const tabs = computed<TabItem[]>(() => [
  { value:'all',label:'전체' },{ value:'vue-nuxt',label:'Vue · Nuxt' },{ value:'astro',label:'Astro' },{ value:'publisher',label:'Publishing' },{ value:'react',label:'React' },
].map(tab => ({ ...tab, count: scopedProjects.value.filter(p => tab.value === 'all' || p.category === tab.value).length })).filter(tab => tab.value === 'all' || tab.count > 0))
const filteredList = computed(() => scopedProjects.value.filter(p => (category.value === 'all' || p.category === category.value) && [p.title,p.subtitle ?? '',...p.tags].some(t => t.toLowerCase().includes(keyword.value.trim().toLowerCase()))))
const agentStories = computed(() => isSi.value || category.value !== 'all' ? [] : workStories.filter(p => p.slug !== 'taskflow' && `${p.name} ${p.subtitle}`.toLowerCase().includes(keyword.value.trim().toLowerCase())))
const designProject = computed(() => filteredList.value.find(p => p.slug === 'ispark-ui'))
const exhibits = computed(() => {
  const stories = agentStories.value.map(story => ({ slug:story.slug, title:story.name, detail:story.subtitle, to:'/work/' + story.slug, external:false }))
  if (designProject.value) stories.splice(Math.min(1, stories.length), 0, { slug:'ispark-ui', title:designProject.value.title, detail:'직접 설계하고 개발한 UI 컴포넌트 라이브러리', to:'https://box3101.github.io/ispark-ui/', external:true })
  return stories
})
const galleryProjects = computed(() => filteredList.value.filter(p => p.slug !== 'ispark-ui'))
function setCategory(value: string) { keyword.value = ''; router.replace({ query: { ...(isSi.value ? { space:'si' } : {}), ...(value === 'all' ? {} : { category:value }) } }) }
async function retry() { await handleSelectProjectPage('all') }
useSeoMeta({ title: () => `${isSi.value ? 'SI 프로젝트' : '프로젝트'} — 이찬용`, description: '공공기관 웹사이트부터 기업 시스템, 디자인 시스템과 AI 도구까지.' })
</script>
<template>
  <div>
    <LayoutPageHeader eyebrow="01 / WORK & STORIES" :title="isSi ? '현장에서 쌓아 온 작업들' : '화면을 만들고, 일하는 방식을 바꾸다.'" :description="isSi ? 'SI 프로젝트 — 공공기관과 기업의 요구를 화면으로 옮긴 기록입니다.' : '퍼블리싱에서 프론트엔드, AI 도구까지. 직접 만들며 넓혀 온 작업의 기록입니다.'" />
    <div class="page">
      <LayoutJournalJourney v-if="!isSi && category === 'all' && !keyword" />
      <div class="toolbar"><UiTab align="left" :model-value="category" :tabs="tabs" aria-label="기술 분류" @update:model-value="setCategory" /><div class="search"><UiInput v-model="keyword" type="search" label="프로젝트 검색" label-hidden placeholder="프로젝트명 · 기술 검색" /></div></div>
      <div v-if="exhibits.length" class="edition-heading"><h2>직접 만든 도구들</h2><span>FEATURE STORIES / 기획에서 구현까지</span></div>
      <div v-if="exhibits.length" class="exhibitions">
        <NuxtLink v-for="item in exhibits" :key="item.slug" :to="item.to" :external="item.external" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noopener noreferrer' : undefined" class="exhibition">
          <ProjectExhibitVisual :kind="item.slug" />
          <div class="exhibition__caption"><h2>{{ item.title }}</h2><span aria-hidden="true">↗</span><p>{{ item.detail }}</p></div>
        </NuxtLink>
      </div>
      <div v-if="projectLoadFailed" class="load-error" role="status"><UiEmpty title="프로젝트를 불러오지 못했습니다" description="잠시 후 다시 시도해 주세요. 공개 여부와는 관계없는 연결 오류입니다." /><UiButton variant="secondary" @click="retry">다시 불러오기</UiButton></div>
      <section v-else-if="galleryProjects.length" aria-labelledby="field-reports-title">
        <div class="edition-heading"><h2 id="field-reports-title">{{ isSi ? 'SI 프로젝트' : '제품과 현장의 기록' }}</h2><span>PROJECT ARCHIVE / {{ galleryProjects.length }}건의 작업</span></div>
        <ul class="grid"><li v-for="p in galleryProjects" :key="p.id"><ProjectCard :project="p" /></li></ul>
      </section>
      <div v-else-if="!exhibits.length" class="empty"><UiEmpty :title="keyword ? '검색 결과가 없습니다' : '이 분류에 등록된 프로젝트가 없습니다'" :description="keyword ? '다른 검색어로 찾아보세요.' : '프로젝트에서 다른 프로젝트를 살펴보세요.'" /></div>
    </div>
  </div>
</template>
<style scoped>
.page { max-width:1400px; margin:0 auto; padding:12px 32px 60px; }
.toolbar { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; margin-bottom:24px; flex-wrap:wrap; }.search { flex:0 1 230px; }
.toolbar :deep(.ui-tab) { width:auto; min-width:0; max-width:100%; flex:1 1 480px; overflow-x:auto; overflow-y:hidden; }
.toolbar :deep(.ui-tab-inner) { justify-content:flex-start; width:max-content; min-width:100%; }
.toolbar :deep(.ui-tab-item) { flex-shrink:0; white-space:nowrap; }
.exhibitions { container-type:inline-size; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:32px 24px; margin-bottom:40px; align-items:stretch; }
.exhibition { color:var(--brand-ink); text-decoration:none; min-width:0; }
.exhibition :deep(.exhibit) { height:auto; min-height:0; aspect-ratio:16 / 10; }
.exhibition :deep(.exhibit__screen) { min-height:0; }

.exhibition__caption { display:grid; grid-template-columns:1fr auto; gap:4px 16px; padding-top:16px; }.exhibition__caption h2 { margin:0; font-size:21px; font-weight:750; letter-spacing:-.045em; line-height:1.4; }.exhibition__caption>span { font-size:25px; }.exhibition__caption p { grid-column:1 / -1; margin:0; color:var(--brand-ink-muted); font-size:13px; line-height:1.7; }.exhibition:hover h2 { color:var(--brand-accent); }
.grid { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:40px 24px; }.grid>li { min-width:0; }
.grid :deep(.card) { background:transparent; border:0; border-radius:0; }.grid :deep(.card__thumb) { background:var(--brand-surface); border:1px solid var(--brand-line); }.grid :deep(.card__body) { padding:16px 0 0; }.grid :deep(.card__title) { font-size:21px; font-weight:700; }.grid :deep(.card__tags) { margin-top:8px; }
.load-error,.empty { text-align:center; padding:40px 0; }
.edition-heading { display:flex; align-items:baseline; justify-content:space-between; gap:12px; border-top:3px double var(--journal-rule); padding-top:12px; margin:0 0 20px; }
.edition-heading h2 { margin:0; font-family:var(--journal-heading); font-size:21px; letter-spacing:-.04em; }
.edition-heading>span { font-size:9px; letter-spacing:.08em; color:var(--brand-ink-muted); }
.exhibition,.grid>li { border-bottom:1px solid var(--brand-line); padding-bottom:22px; }
.exhibition__caption h2,.grid :deep(.card__title) { font-family:var(--journal-heading); font-size:20px; line-height:1.5; }
.exhibition__caption p { font-size:12px; line-height:1.8; }
@media(max-width:600px) { .edition-heading { flex-wrap:wrap; gap:4px; } }
@media(max-width:1200px) { .exhibitions,.grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:900px) { .page { padding:8px 24px 40px; } }
@media(max-width:600px) { .grid,.exhibitions { grid-template-columns:1fr; gap:32px; }.exhibition :deep(.exhibit) { height:auto; aspect-ratio:16 / 10; }.search { flex-basis:100%; }.exhibitions { margin-bottom:40px; } }
</style>

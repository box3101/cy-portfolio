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
function setCategory(value: string) { keyword.value = ''; router.replace({ query: { ...(isSi.value ? { space:'si' } : {}), ...(value === 'all' ? {} : { category:value }) } }) }
async function retry() { await handleSelectProjectPage('all') }
useSeoMeta({ title: () => `${isSi.value ? 'SI 프로젝트' : '프로젝트'} — 이찬용`, description: '공공기관 웹사이트부터 기업 시스템, 디자인 시스템과 AI 도구까지.' })
</script>
<template>
  <div>
    <LayoutPageHeader eyebrow="SELECTED WORK" :title="isSi ? 'SI 프로젝트' : '프로젝트'" :description="isSi ? '현장의 요구를 구현한 작업. 각 프로젝트에서 맡은 역할과 실제 화면을 살펴보세요.' : '화면의 디테일부터 업무를 돕는 도구까지, 직접 만들며 쌓아 온 작업입니다.'" />
    <div class="page">

      <div class="toolbar"><UiTab :model-value="category" :tabs="tabs" aria-label="기술 분류" @update:model-value="setCategory" /><div class="search"><UiInput v-model="keyword" type="search" label="프로젝트 검색" label-hidden placeholder="프로젝트명 · 기술 검색" /></div></div>
      <div v-if="agentStories.length" class="agent-stories"><NuxtLink v-for="story in agentStories" :key="story.slug" :to="`/work/${story.slug}`"><span>{{ story.kind }}</span><h2>{{ story.name }}</h2><p>{{ story.subtitle }}</p><small>만든 이야기 읽기 →</small></NuxtLink></div>
      <div v-if="projectLoadFailed" class="load-error" role="status"><UiEmpty title="프로젝트를 불러오지 못했습니다" description="잠시 후 다시 시도해 주세요. 공개 여부와는 관계없는 연결 오류입니다." /><UiButton variant="secondary" @click="retry">다시 불러오기</UiButton></div>
      <ul v-else-if="filteredList.length" class="grid"><li v-for="p in filteredList" :key="p.id"><ProjectCard :project="p" /></li></ul>
      <div v-else class="empty"><UiEmpty :title="keyword ? '검색 결과가 없습니다' : '이 분류에 등록된 프로젝트가 없습니다'" :description="keyword ? '다른 검색어로 찾아보세요.' : '프로젝트에서 다른 프로젝트를 살펴보세요.'" /></div>
    </div>
  </div>
</template>
<style scoped>
.page { max-width:1180px; margin:0 auto; padding:24px 24px 50px; }.spaces { display:flex; flex-wrap:wrap; gap:12px 25px; padding-bottom:24px; border-bottom:1px solid var(--brand-line); margin-bottom:25px; }.spaces a { color:var(--brand-ink-muted); text-decoration:none; font-size:12px; }.spaces a[aria-current] { color:var(--brand-accent); font-weight:650; }.toolbar { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; margin-bottom:28px; flex-wrap:wrap; }.search { flex:0 1 260px; }.grid { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }.agent-stories { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; margin-bottom:30px; }.agent-stories a { text-decoration:none; color:var(--brand-ink); padding:25px; border:1px solid var(--brand-line); border-radius:10px; background:var(--brand-surface); }.agent-stories a:hover { border-color:var(--brand-accent); }.agent-stories span { font-size:10px; color:var(--brand-accent); }.agent-stories h2 { margin:10px 0 8px; font-size:23px; letter-spacing:-.03em; }.agent-stories p { color:var(--brand-ink-muted); font-size:13px; }.agent-stories small { color:var(--brand-accent); font-size:11px; }.load-error,.empty { text-align:center; padding:30px 0; }
@media(max-width:800px) { .grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:540px) { .grid,.agent-stories { grid-template-columns:1fr; }.search { flex-basis:100%; } }
</style>

<script setup lang="ts">
import { UiBadge } from '@leechanyong/ispark-ui'
import { workStories } from '~/data/workStories'
import { workScreens } from '~/data/workScreens'
definePageMeta({ layout: 'studio' })
useSeoMeta({ title: 'AI 에이전트 & 업무 도구 — 이찬용', description: 'TeamAgent, 제안서 에이전트, TaskFlow. 만든 이유부터 구현 방식과 과정까지 살펴보세요.' })
</script>
<template>
  <StudioWorkShell>
    <p class="eyebrow">02 / BUILDING USEFUL TOOLS</p>
    <h1>직접 만든 AI와 업무 도구.</h1>
    <p class="lead">프로젝트를 선택하면 첫 화면과 주요 기능을 볼 수 있습니다.</p>
    <div class="story-grid">
      <NuxtLink v-for="(story,index) in workStories" :key="story.slug" :to="`/work/${story.slug}`" class="story-card">
        <div v-if="workScreens[story.slug]?.[0]" class="story-card__image"><img :src="workScreens[story.slug]![0]!.src" :alt="workScreens[story.slug]![0]!.alt" loading="lazy" /><span>실제 개발 화면</span></div>
        <div class="story-card__body"><span v-if="story.slug==='proposal-agent'" class="solo-label">기획 · UI/UX 디자인 · 개발 / 1인 제작</span><div class="story-card__meta"><span>0{{ index+1 }}</span><UiBadge size="xs" variant="primary">{{ story.kind }}</UiBadge></div><h2>{{ story.name }}</h2><p>{{ story.subtitle }}</p><div class="story-card__footer">화면과 기능 보기 <span>→</span></div></div>
      </NuxtLink>
    </div>
    <p class="note">개발 중인 화면을 소개합니다. TaskFlow는 AI 기능이 없는 업무 관리 도구입니다.</p>
  </StudioWorkShell>
</template>
<style scoped>
.solo-label { display:block; font-size:10px; color:#285ba5; margin-bottom:16px; font-weight:600; }
.story-card__image { position:relative; background:#edf2f8; border-bottom:1px solid #dce4ee; aspect-ratio:16/10; overflow:hidden; }.story-card__image img { width:100%; height:100%; object-fit:contain; }.story-card__image span { position:absolute; left:12px; bottom:12px; padding:4px 8px; border-radius:4px; background:#142338e6; color:white; font-size:9px; }
.eyebrow { color:#6b7d94; font-size:10px; letter-spacing:.16em; margin:0 0 20px; }h1 { font-size:clamp(32px,3.6vw,54px); font-weight:700; letter-spacing:-.055em; line-height:1.2; margin:0 0 22px; }.lead { color:#5b6b80; font-size:14px; line-height:1.9; margin:0 0 40px; }.story-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }.story-card { color:inherit; text-decoration:none; background:white; border:1px solid #dce4ee; border-radius:12px; overflow:hidden; transition:transform .2s,border-color .2s,box-shadow .2s; }.story-card:hover { transform:translateY(-5px); border-color:#82a8e8; box-shadow:0 15px 30px #173c6410; }.story-card :deep(.visual) { border:0; border-bottom:1px solid #dce4ee; border-radius:0; box-shadow:none; }.story-card__body { padding:24px 20px; }.story-card__meta { display:flex; align-items:center; justify-content:space-between; gap:8px; }.story-card__meta>span { color:#8094ad; font-size:10px; }h2 { font-size:22px; letter-spacing:-.03em; margin:18px 0 10px; }.story-card__body>p { font-size:13px; color:#5d6c80; min-height:44px; }.story-card__footer { border-top:1px solid #e8edf4; padding-top:19px; margin-top:22px; font-size:12px; color:#225bc2; display:flex; justify-content:space-between; }.story-card__footer span { font-size:19px; }.note { font-size:10px; color:#75849a; margin-top:24px; }
@media(max-width:1150px) { .story-grid { grid-template-columns:1fr; }.story-card { display:grid; grid-template-columns:45% 1fr; }.story-card :deep(.visual) { border-bottom:0; }.story-card__body>p { min-height:0; } }
@media(max-width:500px) { .story-card { display:block; }.story-card :deep(.visual) { border-bottom:1px solid #dce4ee; }.story-card__body { padding:20px; }.lead { font-size:13px; }.story-card__body>p { min-height:0; } }
</style>

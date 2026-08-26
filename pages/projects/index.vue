<script setup lang="ts">
import type { CategoryFilter } from '~/composables/store/useProjectStore'

const route = useRoute()
const router = useRouter()

const { projectList, activeCategory, categoryCounts, handleSelectProjectPage, onCategoryChange } =
  useProjectStore()

/** 필터 상태를 URL에서 읽는다. 링크로 공유 가능해야 한다. */
const categoryFromQuery = (): CategoryFilter => {
  const q = route.query.category
  const valid: CategoryFilter[] = ['all', 'vue-nuxt', 'astro', 'react', 'publisher']
  return valid.includes(q as CategoryFilter) ? (q as CategoryFilter) : 'all'
}

await useAsyncData('projects/list', async () => {
  await handleSelectProjectPage(categoryFromQuery())
  return true
})

// 필터를 누르면 URL에 반영한다. 그래야 이력서에 특정 필터 상태를 링크할 수 있다.
const onFilterChange = async (category: CategoryFilter) => {
  await router.replace({
    query: category === 'all' ? {} : { category },
  })
  await onCategoryChange(category)
}

useSeoMeta({
  title: '프로젝트 — Cy\'s Code Canvas',
  description: '공공기관 웹사이트부터 엔터프라이즈 솔루션, 디자인 시스템까지.',
})
</script>

<template>
  <div class="page">
    <header v-reveal class="page__head">
      <h1>프로젝트</h1>
      <p>공공기관 웹사이트부터 엔터프라이즈 솔루션, 디자인 시스템까지.</p>
    </header>

    <ProjectFilter
      :model-value="activeCategory"
      :counts="categoryCounts"
      @update:model-value="onFilterChange"
    />

    <p class="page__count">{{ projectList.length }}건</p>

    <ul v-if="projectList.length" class="grid">
      <li v-for="(p, i) in projectList" :key="p.id" v-reveal="{ delay: Math.min(i, 5) * 60 }">
        <ProjectCard :project="p" />
      </li>
    </ul>

    <p v-else class="page__empty">
      아직 공개된 프로젝트가 없습니다.
    </p>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 24px 20px;
}

.page__head h1 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: var(--step-3);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.page__head p {
  margin: 0 0 26px;
  color: var(--brand-ink-muted);
}

.page__count {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  margin: 0 0 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.page__empty {
  color: var(--brand-ink-muted);
  padding: 40px 0;
  border-top: 1px solid var(--brand-line);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

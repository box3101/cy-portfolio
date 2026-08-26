<script setup lang="ts">
import { UiInput, UiEmpty } from '@leechanyong/ispark-ui'
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

/*
  검색은 서버를 다시 타지 않고 현재 분류로 받아온 목록 안에서 거른다.
  프로젝트 수가 수십 건 규모라 왕복할 이유가 없다.
*/
const keyword = ref('')

const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return projectList.value

  return projectList.value.filter((p) =>
    [p.title, p.subtitle ?? '', ...p.tags].some((t) => t.toLowerCase().includes(k)),
  )
})

// 분류를 바꾸면 검색어는 비운다. 결과가 0인 이유가 둘로 겹쳐 보이지 않게 한다.
const onFilterChangeWithReset = async (category: CategoryFilter) => {
  keyword.value = ''
  await onFilterChange(category)
}

useSeoMeta({
  title: 'Projects — Cy\'s Code Canvas',
  description: '공공기관 웹사이트부터 엔터프라이즈 솔루션, 디자인 시스템까지.',
})
</script>

<template>
  <div>
    <LayoutPageHeader
      eyebrow="What I've built"
      title="Projects"
      description="공공기관 웹사이트부터 엔터프라이즈 솔루션, 디자인 시스템까지."
    />

    <div class="page">
      <!--
        검색과 분류 탭은 둘 다 "목록 좁히기" 도구다. 세로로 떼어놓으면
        서로 다른 단계처럼 읽혀서 한 줄에 둔다.
      -->
      <div class="toolbar">
        <ProjectFilter
          class="toolbar__filter"
          :model-value="activeCategory"
          :counts="categoryCounts"
          @update:model-value="onFilterChangeWithReset"
        />

        <div class="toolbar__search">
          <UiInput
            v-model="keyword"
            type="search"
            label="프로젝트 검색"
            label-hidden
            placeholder="프로젝트명 · 기술 스택으로 검색"
          />
        </div>
      </div>

      <!--
        건수는 검색 중일 때만 띄운다.
        검색어가 없으면 탭의 배지(categoryCounts)가 이미 같은 숫자를 보여주고,
        결과가 0이면 아래 UiEmpty 가 이유까지 설명하므로 둘 다 중복이다.
      -->
      <p v-if="keyword.trim() && filteredList.length" class="page__count">
        {{ filteredList.length }}건
      </p>

      <ul v-if="filteredList.length" class="grid">
        <li v-for="(p, i) in filteredList" :key="p.id" v-reveal="{ delay: Math.min(i, 5) * 60 }">
          <ProjectCard :project="p" />
        </li>
      </ul>

      <!-- 결과 0의 원인이 검색어인지 데이터 부재인지 구분해서 안내한다 -->
      <div v-else class="page__empty">
        <UiEmpty
          v-if="keyword.trim()"
          icon="icon-search"
          title="검색 결과가 없습니다"
          :description="`'${keyword.trim()}' 와 일치하는 프로젝트를 찾지 못했습니다.`"
        />
        <UiEmpty
          v-else
          title="아직 공개된 프로젝트가 없습니다"
          description="정리되는 대로 이곳에 올라옵니다."
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 20px;
}

/*
  flex-end 로 맞춰야 입력 밑변과 탭 밑줄이 같은 선에 놓인다.
  center 로 두면 탭의 밑줄만 아래로 처져 두 요소가 어긋나 보인다.
*/
.toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-bottom: 20px;
}

.toolbar__filter {
  flex: 1 1 320px;
  min-width: 0;
}

.toolbar__search {
  flex: 0 1 280px;
}

/* 좁아지면 검색이 한 줄을 통째로 쓴다 */
@media (max-width: 720px) {
  .toolbar__search {
    flex: 1 1 100%;
  }
}

.page__count {
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  margin: 0 0 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 탭이 이미 아래쪽 구분선을 갖고 있어 여기서 또 그으면 줄이 두 개가 된다 */
.page__empty {
  padding: 32px 0 48px;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

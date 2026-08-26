<!-- pages/smoke/display.vue -->
<script setup lang="ts">
import {
  UiBadge,
  UiBadgeGroup,
  UiAvatar,
  UiAvatarGroup,
  UiTable,
  UiAccordion,
  UiPagination,
  UiIcon,
} from '@leechanyong/ispark-ui'
import type { TableColumn, AccordionItemDef } from '@leechanyong/ispark-ui'

// ===== 테이블 =====
// UiTableProps는 rows가 아니라 data를 받는다
const columns: TableColumn[] = [
  { key: 'title', label: '프로젝트명' },
  { key: 'category', label: '구분' },
  { key: 'period', label: '기간' },
]
const tableData = [
  { title: 'ispark-ui', category: 'Design System', period: '2025.04 —' },
  { title: 'TaskFlow', category: 'Full-stack', period: '2026.08 —' },
]

// ===== 아코디언 =====
const accordionItems: AccordionItemDef[] = [
  { value: 'career', title: '경력 사항', content: '이즈파크 AX Group (2025.03 — 현재)' },
  { value: 'edu', title: '학력', content: '동국대학교' },
]

// ===== 페이지네이션 =====
const page = ref(1)
</script>

<template>
  <main data-smoke="display" style="padding: 32px; display: grid; gap: 24px">
    <h1>Display 그룹</h1>

    <section data-c="UiBadge">
      <UiBadge variant="primary" size="md">진행중</UiBadge>
      <UiBadgeGroup>
        <UiBadge>Vue3</UiBadge>
        <UiBadge>Nuxt3</UiBadge>
      </UiBadgeGroup>
    </section>

    <section data-c="UiAvatar">
      <UiAvatar name="이찬용" shape="circle" />
      <UiAvatarGroup>
        <UiAvatar name="이찬용" />
        <UiAvatar name="김철수" />
      </UiAvatarGroup>
    </section>

    <section data-c="UiIcon">
      <UiIcon name="plus" />
    </section>

    <section data-c="UiTable">
      <UiTable :columns="columns" :data="tableData" />
    </section>

    <section data-c="UiAccordion">
      <UiAccordion :items="accordionItems" />
    </section>

    <!--
      UiProgress는 Storybook 문서에는 있으나 npm 0.5.16 패키지에 포함되어 있지 않다.
      (ESM/CJS 번들 및 index.d.ts 전부에서 누락 — 레포보다 배포본이 뒤처진 상태)
      ispark-ui 재배포 후 이 섹션을 복구한다.
    -->

    <section data-c="UiPagination">
      <UiPagination v-model="page" :total-count="120" :page-size="10" />
    </section>
  </main>
</template>

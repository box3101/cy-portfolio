<!-- pages/smoke/index.vue -->
<script setup lang="ts">
// ===== 스모크 대상 그룹 =====
// 합계 34 = 고유 컴포넌트 33개 + UiProgress 중복 1회(Display/Feedback 양쪽에서 검증)
const groups = [
  { path: '/smoke/form', label: 'Form', count: 6 },
  { path: '/smoke/display', label: 'Display', count: 9 },
  { path: '/smoke/overlay', label: 'Overlay', count: 4 },
  { path: '/smoke/feedback', label: 'Feedback', count: 5 },
  { path: '/smoke/data', label: 'Data', count: 10 },
]
</script>

<template>
  <main data-smoke="index" style="padding: 32px; font-family: system-ui">
    <h1>ispark-ui SSR 스모크</h1>
    <ul>
      <li v-for="g in groups" :key="g.path">
        <NuxtLink :to="g.path">{{ g.label }} ({{ g.count }})</NuxtLink>
      </li>
    </ul>
  </main>
</template>

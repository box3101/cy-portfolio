<!-- pages/smoke/iso/tab.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiTab } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
const v = ref('all')
const tabs: TabItem[] = [{ label: '전체', value: 'all' }]
</script>

<template>
  <main data-iso="tab" style="padding:24px">
    <h1>UiTab</h1>
    <UiTab v-model="v" :tabs="tabs" />
  </main>
</template>

<!-- pages/smoke/iso/select.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiSelect } from '@leechanyong/ispark-ui'
import type { SelectOption } from '@leechanyong/ispark-ui'
const v = ref('a')
const opts: SelectOption[] = [{ label: 'A', value: 'a' }]
</script>

<template>
  <main data-iso="select" style="padding:24px">
    <h1>UiSelect</h1>
    <UiSelect v-model="v" :options="opts" />
  </main>
</template>

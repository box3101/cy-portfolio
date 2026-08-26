<!-- pages/smoke/iso/multiselect.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiMultiSelect } from '@leechanyong/ispark-ui'
import type { MultiSelectOption } from '@leechanyong/ispark-ui'
const v = ref<string[]>([])
const opts: MultiSelectOption[] = [{ label: 'A', value: 'a' }]
</script>

<template>
  <main data-iso="multiselect" style="padding:24px">
    <h1>UiMultiSelect</h1>
    <UiMultiSelect v-model="v" :options="opts" />
  </main>
</template>

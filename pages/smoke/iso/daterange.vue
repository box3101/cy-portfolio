<!-- pages/smoke/iso/daterange.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiDateRangePicker } from '@leechanyong/ispark-ui'
import type { DateRange } from '@leechanyong/ispark-ui'
const v = ref<DateRange>({ start: undefined, end: undefined })
</script>

<template>
  <main data-iso="daterange" style="padding:24px">
    <h1>UiDateRangePicker</h1>
    <UiDateRangePicker v-model="v" />
  </main>
</template>

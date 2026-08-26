<!-- pages/smoke/iso/datepicker.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiDatePicker } from '@leechanyong/ispark-ui'
import type { DateValue } from '@internationalized/date'
const v = shallowRef<DateValue | undefined>(undefined)
</script>

<template>
  <main data-iso="datepicker" style="padding:24px">
    <h1>UiDatePicker</h1>
    <UiDatePicker v-model="v" />
  </main>
</template>

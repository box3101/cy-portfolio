<!-- pages/smoke/iso/calendar.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiCalendarMonth } from '@leechanyong/ispark-ui'

</script>

<template>
  <main data-iso="calendar" style="padding:24px">
    <h1>UiCalendarMonth</h1>
    <UiCalendarMonth :year="2026" :month="8" :events="[]" />
  </main>
</template>

<!-- pages/smoke/iso/fileupload.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiFileUpload } from '@leechanyong/ispark-ui'

</script>

<template>
  <main data-iso="fileupload" style="padding:24px">
    <h1>UiFileUpload</h1>
    <UiFileUpload accept=".pdf" />
  </main>
</template>

<!-- pages/smoke/iso/filelist.vue — SSR 격리 테스트 -->
<script setup lang="ts">
import { UiFileList } from '@leechanyong/ispark-ui'
import type { FileItem } from '@leechanyong/ispark-ui'
const files: FileItem[] = [{ id: 1, filename: 'a.pdf', path: '/a.pdf', mimetype: 'application/pdf' }]
const getFileUrl = (path: string) => path
</script>

<template>
  <main data-iso="filelist" style="padding:24px">
    <h1>UiFileList</h1>
    <UiFileList :files="files" :get-url="getFileUrl" />
  </main>
</template>

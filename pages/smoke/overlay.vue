<!-- pages/smoke/overlay.vue -->
<script setup lang="ts">
import {
  UiModal,
  UiDropdownMenu,
  UiDrawer,
  UiTooltip,
  UiButton,
} from '@leechanyong/ispark-ui'
import type { DropdownMenuItemDef } from '@leechanyong/ispark-ui'

// ===== 상태 =====
// 오버레이는 닫힌 상태의 트리거만 서버에서 렌더되면 된다.
// 열린 상태는 클라이언트 전용이므로 SSR 검증 대상이 아니다.
const isModalOpen = ref(false)
const isDrawerOpen = ref(false)

const menuItems: DropdownMenuItemDef[] = [
  { label: '수정', value: 'edit' },
  { label: '삭제', value: 'delete' },
]
</script>

<template>
  <main data-smoke="overlay" style="padding: 32px; display: grid; gap: 24px">
    <h1>Overlay 그룹</h1>

    <section data-c="UiModal">
      <h2>모달</h2>
      <UiButton @click="isModalOpen = true">모달 열기</UiButton>
      <UiModal v-model="isModalOpen" title="스모크 모달">
        <p>모달 본문</p>
      </UiModal>
    </section>

    <section data-c="UiDropdownMenu">
      <h2>드롭다운</h2>
      <!-- UiDropdownMenu는 default가 아니라 trigger 네임드 슬롯을 받는다 -->
      <UiDropdownMenu :items="menuItems">
        <template #trigger>
          <UiButton>메뉴 열기</UiButton>
        </template>
      </UiDropdownMenu>
    </section>

    <section data-c="UiDrawer">
      <h2>서랍</h2>
      <UiButton @click="isDrawerOpen = true">서랍 열기</UiButton>
      <UiDrawer v-model="isDrawerOpen" title="스모크 서랍">
        <p>서랍 본문</p>
      </UiDrawer>
    </section>

    <section data-c="UiTooltip">
      <h2>툴팁</h2>
      <UiTooltip content="이것은 툴팁입니다">
        <UiButton>도움말</UiButton>
      </UiTooltip>
    </section>
  </main>
</template>

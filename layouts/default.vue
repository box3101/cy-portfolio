<script setup lang="ts">
const { handleSelectProfile } = useProfileStore()

// 헤더·푸터는 레이아웃에 있어 페이지의 useAsyncData보다 먼저 렌더된다.
// 프로필을 여기서 채우지 않으면 서버는 빈 값, 클라이언트는 채워진 값을 그려
// hydration mismatch가 난다.
await useAsyncData('layout/profile', async () => {
  await handleSelectProfile()
  return true
})
</script>

<template>
  <div class="shell">
    <LayoutTheHeader />
    <main class="shell__main">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.shell__main {
  flex: 1;
}
</style>

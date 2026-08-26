<script setup lang="ts">
const { handleSelectProfile } = useProfileStore()

await useAsyncData('layout/profile', async () => {
  await handleSelectProfile()
  return true
})
</script>

<template>
  <!-- 히어로 전용 레이아웃. 화면을 통째로 쓰므로 헤더·푸터를 두지 않는다. -->
  <div class="hero-shell">
    <LayoutTheCursor />
    <slot />
  </div>
</template>

<style scoped>
.hero-shell {
  min-height: 100dvh;
}
</style>

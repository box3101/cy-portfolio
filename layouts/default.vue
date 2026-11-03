<script setup lang="ts">
const { handleSelectProfile } = useProfileStore()

// 헤더·푸터는 레이아웃에 있어 페이지의 useAsyncData보다 먼저 렌더된다.
// 프로필을 여기서 채우지 않으면 서버는 빈 값, 클라이언트는 채워진 값을 그려
// hydration mismatch가 난다.
await useAsyncData('layout/profile', async () => {
  await handleSelectProfile()
  return true
}, { dedupe: 'cancel', getCachedData: () => undefined })
</script>

<template>
  <div class="shell journal-shell">
    <a class="shell__skip" href="#portfolio-main">본문으로 건너뛰기</a>
    <LayoutTheCursor />
    <LayoutTheHeader />
    <div class="journal-paper">
    <LayoutJournalMasthead />
    <main id="portfolio-main" class="shell__main">
      <slot />
    </main>
    <LayoutTheFooter />
    </div>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  padding-left: var(--portfolio-rail);
  display: flex;
  flex-direction: column;
}

.shell__main {
  flex: 1;
}
.shell__main { min-width:0; }
.shell__skip { position:fixed; top:-100px; left:24px; z-index:100; padding:12px 20px; background:var(--brand-surface); color:var(--brand-ink); }
.shell__skip:focus { top:12px; }
@media(max-width:900px) { .shell { padding-left:0; } }
</style>

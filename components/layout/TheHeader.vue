<script setup lang="ts">
const { toggleTheme, restoreTheme } = useTheme()

// ===== 내비게이션 =====
// 슬라이드 네비게이션을 쓰지 않는다. 각 화면이 고유 URL을 갖도록 라우트로 구성한다.
const navItems = [
  { to: '/', label: '홈' },
  { to: '/projects', label: '프로젝트' },
  { to: '/about', label: '소개' },
]

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

onMounted(() => restoreTheme())
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="brand" aria-label="홈으로">
        <span class="brand__mark">CY</span>
        <span class="brand__name">Code Canvas</span>
      </NuxtLink>

      <nav class="nav" aria-label="주요 메뉴">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav__link"
          :class="{ 'is-active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <button type="button" class="theme-btn" aria-label="테마 전환" @click="toggleTheme">
        <span aria-hidden="true">◐</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in oklab, var(--brand-surface) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--brand-line);
}

.header__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
  color: var(--brand-ink);
  text-decoration: none;
}

.brand__mark {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: var(--brand-accent);
  color: var(--brand-accent-ink);
  border-radius: 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.nav {
  display: flex;
  gap: 22px;
}

.nav__link {
  position: relative;
  color: var(--brand-ink-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  padding: 4px 0;
  transition: color 0.15s;
}

.nav__link:hover {
  color: var(--brand-ink);
}

.nav__link.is-active {
  color: var(--brand-ink);
  font-weight: 600;
}

.nav__link.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -15px;
  height: 2px;
  background: var(--brand-accent);
}

.theme-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid var(--brand-line);
  border-radius: 8px;
  background: var(--brand-surface);
  color: var(--brand-ink-muted);
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s, color 0.15s;
}

.theme-btn:hover {
  border-color: var(--brand-accent);
  color: var(--brand-ink);
}

@media (max-width: 640px) {
  .nav {
    gap: 16px;
  }
  .brand__name {
    display: none;
  }
}
</style>

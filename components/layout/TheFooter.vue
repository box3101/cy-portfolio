<script setup lang="ts">
const { profile } = useProfileStore()

const links = computed(() =>
  [
    { label: 'GitHub', href: profile.value?.github_url },
    { label: 'Blog', href: profile.value?.blog_url },
    { label: 'Email', href: profile.value?.email ? `mailto:${profile.value.email}` : null },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href)),
)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__name">{{ profile?.name ?? 'Cy' }}</p>

      <ul v-if="links.length" class="footer__links">
        <li v-for="l in links" :key="l.label">
          <a :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
        </li>
      </ul>

      <p class="footer__note">
        이 사이트는 직접 만든 디자인 시스템
        <a href="https://www.npmjs.com/package/@leechanyong/ispark-ui" target="_blank" rel="noopener noreferrer">
          @leechanyong/ispark-ui
        </a>
        로 만들었습니다.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--brand-line);
  margin-top: 80px;
}

.footer__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 24px 60px;
  display: grid;
  gap: 14px;
}

.footer__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
}

.footer__links {
  display: flex;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer__links a {
  color: var(--brand-ink-muted);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.8125rem;
}

.footer__links a:hover {
  color: var(--brand-accent);
}

.footer__note {
  margin: 0;
  color: var(--brand-ink-muted);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.footer__note a {
  color: var(--brand-accent);
  text-decoration: none;
  font-family: var(--font-body);
}
</style>

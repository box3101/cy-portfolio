<script setup lang="ts">
import { UiEmpty } from '@leechanyong/ispark-ui'

const { profile, handleSelectProfile } = useProfileStore()

await useAsyncData('contact', async () => {
  await handleSelectProfile()
  return true
})

useSeoMeta({
  title: "Contact — Cy's Code Canvas",
  description: '이찬용에게 연락하기',
})

const channels = computed(() =>
  [
    { label: 'Email', value: profile.value?.email, href: profile.value?.email ? `mailto:${profile.value.email}` : null },
    { label: 'GitHub', value: profile.value?.github_url?.replace(/^https?:\/\//, ''), href: profile.value?.github_url },
    { label: 'Blog', value: profile.value?.blog_url?.replace(/^https?:\/\//, ''), href: profile.value?.blog_url },
  ].filter((c): c is { label: string; value: string; href: string } => Boolean(c.href && c.value)),
)
</script>

<template>
  <div>
    <LayoutPageHeader
      eyebrow="Get in touch"
      title="Contact"
      description="새로운 기회나 협업 제안은 언제든 환영합니다."
    />

    <div class="page">
      <ul v-if="channels.length" v-reveal="{ delay: 80 }" class="channels">
      <li v-for="c in channels" :key="c.label">
        <span class="channels__label">{{ c.label }}</span>
        <a :href="c.href" target="_blank" rel="noopener noreferrer">{{ c.value }}</a>
      </li>
    </ul>

      <UiEmpty v-else class="page__empty" title="등록된 연락처가 없습니다" />
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 20px;
}

.channels {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
  border-top: 1px solid var(--brand-line);
}

.channels li {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--brand-line);
}

.channels__label {
  font-family: var(--font-body);
  font-size: var(--step--1);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.channels a {
  font-size: var(--step-1);
  color: var(--brand-ink);
  text-decoration: none;
  word-break: break-all;
}

.channels a:hover {
  color: var(--brand-accent);
}

.page__empty {
  color: var(--brand-ink-muted);
  padding: 40px 0;
  border-top: 1px solid var(--brand-line);
}

@media (max-width: 640px) {
  .channels li {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { selectedProject, handleSelectProject } = useProjectStore()

await useAsyncData(`project/${slug.value}`, async () => {
  await handleSelectProject(slug.value)
  return true
}, { getCachedData: () => undefined })

// 없는 slug는 404로 응답한다. 빈 화면을 200으로 주면 검색엔진이 색인해버린다.
if (!selectedProject.value) {
  throw createError({ statusCode: 404, statusMessage: '프로젝트를 찾을 수 없습니다', fatal: true })
}

const project = computed(() => selectedProject.value!)
const period = computed(() => formatPeriod(project.value.period_start, project.value.period_end))
const renderedContent = computed(() => project.value.content ? marked(project.value.content) : '')

const links = computed(() =>
  [
    { label: 'Repository', href: project.value.repo_url },
    { label: 'Live', href: project.value.live_url },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href)),
)

useSeoMeta({
  title: () => `${project.value.title} — Cy's Code Canvas`,
  description: () => project.value.summary ?? project.value.title,
  ogTitle: () => project.value.title,
  ogDescription: () => project.value.summary ?? project.value.title,
  ogType: 'article',
})
</script>

<template>
  <article class="detail">
    <NuxtLink to="/projects" class="detail__back">← 프로젝트 목록</NuxtLink>

    <header v-reveal class="detail__head">
      <p v-if="project.subtitle" class="detail__eyebrow">{{ project.subtitle }}</p>
      <h1>{{ project.title }}</h1>
      <p v-if="project.summary" class="detail__summary">{{ project.summary }}</p>
    </header>

    <dl v-reveal="{ delay: 80 }" class="meta">
      <div class="meta__row">
        <dt>Period</dt>
        <dd class="meta__mono">{{ period }}</dd>
      </div>
      <div v-if="project.role" class="meta__row">
        <dt>Role</dt>
        <dd>{{ project.role }}</dd>
      </div>
      <div v-if="project.tags.length" class="meta__row">
        <dt>Stack</dt>
        <dd>
          <ul class="tags">
            <li v-for="t in project.tags" :key="t">{{ t }}</li>
          </ul>
        </dd>
      </div>
      <div v-if="links.length" class="meta__row">
        <dt>Links</dt>
        <dd>
          <ul class="links">
            <li v-for="l in links" :key="l.label">
              <a :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }} ↗</a>
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <div v-if="project.content" class="detail__body" v-html="renderedContent" />
  </article>
</template>

<style scoped>
.detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px 20px;
}

.detail__back {
  display: inline-block;
  margin-bottom: 28px;
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  text-decoration: none;
}

.detail__back:hover {
  color: var(--brand-accent);
}

.detail__eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-body);
  font-size: var(--step--1);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.detail__head h1 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: var(--step-3);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-wrap: balance;
}

.detail__summary {
  margin: 0 0 34px;
  font-size: var(--step-1);
  color: var(--brand-ink-muted);
  line-height: 1.6;
}

.meta {
  margin: 0 0 40px;
  padding: 20px 0;
  border-top: 1px solid var(--brand-line);
  border-bottom: 1px solid var(--brand-line);
  display: grid;
  gap: 12px;
}

.meta__row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 16px;
  align-items: start;
}

.meta__row dt {
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  padding-top: 2px;
}

.meta__row dd {
  margin: 0;
}

.meta__mono {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
}

.tags,
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tags li {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--brand-ink-muted);
  background: color-mix(in oklab, var(--brand-line) 35%, transparent);
  border: 1px solid var(--brand-line);
  padding: 2px 8px;
  border-radius: 5px;
}

.links {
  gap: 14px;
}

.links a {
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-accent);
  text-decoration: none;
}

.detail__body :deep(h2) {
  margin: 1.6em 0 0.6em;
  font-size: var(--step-1);
  font-weight: 700;
}

.detail__body :deep(p) {
  margin: 0 0 1.1em;
  line-height: 1.8;
}

.detail__body :deep(ul) {
  margin: 0 0 1.1em;
  padding-left: 1.4em;
  line-height: 1.8;
}

.detail__body :deep(blockquote) {
  margin: 0.8em 0;
  padding: 12px 16px;
  border-left: 3px solid var(--brand-accent);
  background: color-mix(in oklab, var(--brand-line) 20%, transparent);
  border-radius: 4px;
}

.detail__body :deep(blockquote strong) {
  font-weight: 700;
}

.detail__body :deep(a) {
  color: var(--brand-accent);
  text-decoration: none;
}

.detail__body :deep(a:hover) {
  text-decoration: underline;
}
</style>

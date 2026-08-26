<script setup lang="ts">
import { UiBadge, UiBadgeGroup } from '@leechanyong/ispark-ui'
import type { Project } from '~/types/database'

const props = defineProps<{ project: Project }>()

const period = computed(() => formatPeriod(props.project.period_start, props.project.period_end))

/** 직접 확인 가능한 프로젝트에만 배지를 붙인다. */
const badge = computed(() => {
  const p = props.project
  if (p.slug === 'ispark-ui') return 'NPM'
  if (p.live_url) return 'LIVE'
  return null
})

const categoryLabel: Record<string, string> = {
  'vue-nuxt': 'Vue · Nuxt',
  astro: 'Astro',
  react: 'React',
  publisher: 'Publishing',
}
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="card">
    <div class="card__thumb" :class="{ 'is-accent': Boolean(badge) }">
      <span v-if="badge" class="card__badge">
        <UiBadge variant="primary" size="xs">{{ badge }}</UiBadge>
      </span>
      <span class="card__glyph">{{ project.title }}</span>
    </div>

    <div class="card__body">
      <span class="card__cat">{{ project.subtitle || categoryLabel[project.category] }}</span>
      <h3 class="card__title">{{ project.title }}</h3>
      <span class="card__period">{{ period }}</span>

      <UiBadgeGroup
        v-if="project.tags.length"
        class="card__tags"
        :gap="5"
        wrap
        aria-label="사용 기술"
      >
        <UiBadge v-for="tag in project.tags.slice(0, 4)" :key="tag" size="xs">{{ tag }}</UiBadge>
      </UiBadgeGroup>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s;
}

.card:hover {
  border-color: var(--brand-accent);
  transform: translateY(-2px);
}

.card__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--brand-line);
  background: color-mix(in oklab, var(--brand-line) 30%, var(--brand-surface));
  overflow: hidden;
}

.card__thumb::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(color-mix(in oklab, var(--brand-line) 60%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--brand-line) 60%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
}

.card__thumb.is-accent {
  background: color-mix(in oklab, var(--brand-accent) 10%, var(--brand-surface));
}

.card__glyph {
  position: relative;
  max-width: 80%;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  padding: 7px 14px;
  border-radius: 8px;
}

/* 배지 자체의 모양은 UiBadge가 갖는다. 여기서는 위치만 잡는다. */
.card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.card__body {
  padding: 15px 16px 17px;
  display: grid;
  gap: 6px;
  align-content: start;
}

.card__cat {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
}

.card__title {
  margin: 0;
  font-size: var(--step-1);
  font-weight: 600;
  letter-spacing: -0.012em;
  line-height: 1.35;
}

.card__period {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
}

/* 배치는 UiBadgeGroup(flex + wrap + gap)이 맡는다. 여백만 얹는다. */
.card__tags {
  margin-top: 4px;
}
</style>

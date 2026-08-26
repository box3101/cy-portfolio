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

// 프로젝트별 로고 이미지 매핑
const logoMap: Record<string, string> = {
  'ispark-ui': '/images/pt-ispark-ui.svg',
  'taskflow': '/images/pt-taskflow.svg',
  'sgate-okr-solution': '/images/pt-sgate.svg',
  'movie-dashboard': '/images/pt-movie-dashboard.svg',
  'yeonsu-library-website': '/images/pf-yeonsu-library.png',
  'korean-bank-evaluation': '/images/pt-koreaBank.jpg',
  'incheon-jung-gu-edu': '/images/incheon-jung-gu-edu.jpg',
  'incheon-city': '/images/pt-incheon-city.png',
  'samsung-sdi-gsop': '/images/samsung-sdi-gsop.png',
  'g4b-business-support': '/images/g4b-business-support.svg',
  'ict-ksa-system': '/images/ict-ksa-system.png',
  'animal-flash-cards': '/images/react-portfolio.png',
}

// 프로젝트별 hover 오버레이 브랜드 컬러
const brandColorMap: Record<string, string> = {
  'ispark-ui': 'rgba(99, 102, 241, 0.92)',
  'taskflow': 'rgba(59, 130, 246, 0.92)',
  'sgate-okr-solution': 'rgba(216, 0, 191, 0.91)',
  'movie-dashboard': 'rgba(38, 3, 3, 0.9)',
  'yeonsu-library-website': 'rgba(42, 0, 145, 0.9)',
  'korean-bank-evaluation': 'rgba(0, 13, 93, 0.9)',
  'incheon-jung-gu-edu': 'rgba(216, 0, 191, 0.91)',
  'incheon-city': 'rgb(44, 44, 109)',
  'samsung-sdi-gsop': 'rgba(0, 44, 237, 0.9)',
  'g4b-business-support': 'rgba(23, 21, 28, 0.9)',
  'ict-ksa-system': 'rgba(255, 147, 184, 0.87)',
  'animal-flash-cards': 'rgba(42, 0, 145, 0.9)',
}

const logoSrc = computed(() => logoMap[props.project.slug])
const brandColor = computed(() => brandColorMap[props.project.slug] ?? 'rgba(20, 21, 28, 0.88)')
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="card">
    <div class="card__thumb">
      <span v-if="badge" class="card__badge">
        <UiBadge variant="primary" size="xs">{{ badge }}</UiBadge>
      </span>

      <!-- 로고 이미지 -->
      <img
        v-if="logoSrc"
        :src="logoSrc"
        :alt="project.title"
        class="card__logo"
        loading="lazy"
      />
      <span v-else class="card__glyph">{{ project.title }}</span>

      <!-- hover 오버레이 -->
      <div class="card__overlay" :style="{ backgroundColor: brandColor }">
        <strong class="card__overlay-title">Overview</strong>
        <p class="card__overlay-info">
          ({{ period }})<br />
          {{ project.summary }}
        </p>
        <div class="card__overlay-tags">
          <span v-for="tag in project.tags" :key="tag" class="card__overlay-tag" :style="{ backgroundColor: brandColor }">
            # {{ tag }}
          </span>
        </div>
      </div>
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
  aspect-ratio: 10 / 11;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--brand-line);
  background: #fff;
  overflow: hidden;
}

/* 로고 이미지 */
.card__logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  padding: 14% 12%;
}

/* 로고 없을 때 텍스트 폴백 */
.card__glyph {
  position: relative;
  max-width: 80%;
  text-align: center;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  padding: 7px 14px;
  border-radius: 8px;
}

/* hover 오버레이 */
.card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  text-align: center;
}

.card:hover .card__overlay {
  opacity: 1;
}

.card__overlay-title {
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 12px;
}

.card__overlay-info {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.02em;
  margin: 0;
  max-width: 90%;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__overlay-tags {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  width: 80%;
}

.card__overlay-tag {
  display: inline-block;
  padding: 5px 8px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  border-radius: 6px;
  white-space: nowrap;
}

/* 배지 자체의 모양은 UiBadge가 갖는다. 여기서는 위치만 잡는다. */
.card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
}

.card__body {
  padding: 15px 16px 17px;
  display: grid;
  gap: 6px;
  align-content: start;
}

.card__cat {
  font-family: var(--font-body);
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
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
}

/* 배치는 UiBadgeGroup(flex + wrap + gap)이 맡는다. 여백만 얹는다. */
.card__tags {
  margin-top: 4px;
}

@media (max-width: 860px) {
  .card__overlay-info {
    font-size: 12px;
    -webkit-line-clamp: 4;
  }
  .card__overlay-tags {
    display: none;
  }
}
</style>

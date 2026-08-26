<script setup lang="ts">
import { UiProgress } from '@leechanyong/ispark-ui'

const { profile, careerList, careerWithProjects, skillList, handleSelectAbout } = useProfileStore()

await useAsyncData('about', async () => {
  await handleSelectAbout()
  return true
})

useSeoMeta({
  title: "About — Cy's Code Canvas",
  description: () => profile.value?.headline ?? '이찬용 프론트엔드 개발자 소개',
})

const skillGroups = computed(() => {
  // 라벨은 영문이다. 히어로의 'Skills' 링크가 이 섹션으로 들어오므로
  // 상위 제목(Skills)과 목소리를 맞춘다. 기술 이름 자체도 대부분 영문이다.
  const labels: Record<string, string> = {
    language: 'Language',
    framework: 'Framework',
    tool: 'Tools',
    design: 'Design',
  }
  const groups: { key: string; label: string; items: typeof skillList.value }[] = []

  for (const key of ['language', 'framework', 'tool', 'design']) {
    const items = skillList.value.filter((s) => s.category === key)
    if (items.length) groups.push({ key, label: labels[key], items })
  }
  return groups
})
</script>

<template>
  <div>
    <LayoutPageHeader
      eyebrow="Who I am"
      title="About"
      :description="profile?.headline ?? undefined"
    />

    <div class="page">
      <p v-if="profile?.bio" v-reveal class="page__bio">{{ profile.bio }}</p>

      <section v-if="careerList.length" v-reveal class="block">
      <h2>Career</h2>
      <ul class="career">
        <li v-for="c in careerWithProjects" :key="c.id">
          <div class="career__period">{{ formatPeriod(c.period_start, c.period_end) }}</div>
          <div class="career__body">
            <h3>{{ c.company }}</h3>
            <p class="career__role">{{ c.position }}</p>
            <p v-if="c.description" class="career__desc">{{ c.description }}</p>

            <!-- 회사 안의 프로젝트. 없으면 통째로 렌더하지 않는다. -->
            <ol v-if="c.projects.length" class="proj">
              <li v-for="p in c.projects" :key="p.id" class="proj__item">
                <h4 class="proj__title">{{ p.title }}</h4>

                <p v-if="p.outcome" class="proj__outcome">{{ p.outcome }}</p>

                <ul v-if="p.tech_stack.length" class="proj__stack">
                  <li v-for="t in p.tech_stack" :key="t">{{ t }}</li>
                </ul>

                <ul v-if="p.highlights.length" class="proj__points">
                  <li v-for="(h, i) in p.highlights" :key="i">{{ h }}</li>
                </ul>
              </li>
            </ol>
          </div>
        </li>
      </ul>
    </section>

    <!-- 히어로의 'Skills' 링크가 이 앵커로 들어온다 -->
    <section id="skills" v-if="skillGroups.length" v-reveal="{ delay: 80 }" class="block">
      <h2>Skills</h2>
      <div class="skills">
        <div v-for="g in skillGroups" :key="g.key" class="skills__group">
          <h3>{{ g.label }}</h3>
          <ul>
            <li v-for="s in g.items" :key="s.id">
              <span class="skills__name">{{ s.name }}</span>
              <!--
                label prop은 화면에 보이는 라벨이다. 이름은 왼쪽 칸에 이미 있으므로
                중복 노출을 피하고 스크린리더용 설명만 aria-label로 준다.
              -->
              <UiProgress
                class="skills__bar"
                :value="s.level"
                :max="5"
                size="sm"
                :aria-label="`${s.name} 숙련도 5점 만점에 ${s.level}점`"
              />
            </li>
          </ul>
        </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 프로젝트 페이지와 같은 1180px. 페이지를 오갈 때 좌측 시작선이 어긋나지 않게 한다. */
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 20px;
}

.page__bio {
  margin: 0;
  max-width: 62ch;
  color: var(--brand-ink-muted);
  line-height: 1.8;
}

.block {
  margin-top: 52px;
}

.block h2 {
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--brand-line);
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.career {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 24px;
}

.career > li {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
}

.career__period {
  font-family: var(--font-body);
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
  padding-top: 3px;
}

.career__body h3 {
  margin: 0 0 3px;
  font-size: var(--step-1);
  font-weight: 600;
}

.career__role {
  margin: 0 0 8px;
  font-size: var(--step--1);
  color: var(--brand-accent);
}

.career__desc {
  margin: 0;
  max-width: 72ch;
  color: var(--brand-ink-muted);
  line-height: 1.7;
}

/* ===== 경력 안의 프로젝트 ===== */
.proj {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 20px;
}

/*
  회사와 프로젝트를 들여쓰기가 아니라 왼쪽 선으로 나눈다.
  들여쓰기만으로는 프로젝트가 3개 붙었을 때 어디까지가 한 덩어리인지
  눈으로 안 잡힌다.
*/
.proj__item {
  padding-left: 14px;
  border-left: 2px solid var(--brand-line);
}

.proj__title {
  margin: 0 0 6px;
  font-size: var(--step-0);
  font-weight: 600;
}

.proj__outcome {
  margin: 0 0 8px;
  font-size: var(--step--1);
  color: var(--brand-accent);
  font-weight: 500;
}

.proj__stack {
  list-style: none;
  margin: 0 0 10px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proj__stack li {
  padding: 2px 8px;
  border: 1px solid var(--brand-line);
  border-radius: 999px;
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  white-space: nowrap;
}

.proj__points {
  margin: 0;
  padding-left: 16px;
  max-width: 72ch;
  display: grid;
  gap: 4px;
  color: var(--brand-ink-muted);
  font-size: var(--step--1);
  line-height: 1.7;
}

.proj__points li::marker {
  color: var(--brand-line);
}

.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px 32px;
}

.skills__group h3 {
  margin: 0 0 10px;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-ink-muted);
  font-weight: 500;
}

.skills__group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.skills__group li {
  display: grid;
  grid-template-columns: 1fr 96px;
  align-items: center;
  gap: 14px;
  font-size: var(--step-0);
}

.skills__name {
  min-width: 0;
}

/* 막대 자체의 모양은 UiProgress가 갖는다. 여기서는 폭만 잡는다. */
.skills__bar {
  width: 96px;
}

@media (max-width: 640px) {
  .career > li {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .skills {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
const { profile, careerList, skillList, handleSelectAbout } = useProfileStore()

await useAsyncData('about', async () => {
  await handleSelectAbout()
  return true
})

useSeoMeta({
  title: "소개 — Cy's Code Canvas",
  description: () => profile.value?.headline ?? '이찬용 프론트엔드 개발자 소개',
})

const skillGroups = computed(() => {
  const labels: Record<string, string> = {
    language: '언어',
    framework: '프레임워크',
    tool: '도구',
    design: '디자인',
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
  <div class="page">
    <header class="page__head">
      <h1>소개</h1>
      <p v-if="profile?.headline" class="page__headline">{{ profile.headline }}</p>
      <p v-if="profile?.bio" class="page__bio">{{ profile.bio }}</p>
    </header>

    <section v-if="careerList.length" class="block">
      <h2>경력</h2>
      <ul class="career">
        <li v-for="c in careerList" :key="c.id">
          <div class="career__period">{{ formatPeriod(c.period_start, c.period_end) }}</div>
          <div class="career__body">
            <h3>{{ c.company }}</h3>
            <p class="career__role">{{ c.position }}</p>
            <p v-if="c.description" class="career__desc">{{ c.description }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="skillGroups.length" class="block">
      <h2>기술</h2>
      <div class="skills">
        <div v-for="g in skillGroups" :key="g.key" class="skills__group">
          <h3>{{ g.label }}</h3>
          <ul>
            <li v-for="s in g.items" :key="s.id">
              <span>{{ s.name }}</span>
              <span class="skills__level" :aria-label="`5점 만점에 ${s.level}점`">
                <i v-for="n in 5" :key="n" :class="{ 'is-on': n <= s.level }" aria-hidden="true"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 56px 24px 20px;
}

.page__head h1 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: var(--step-3);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.page__headline {
  margin: 0 0 12px;
  font-size: var(--step-1);
  font-weight: 500;
}

.page__bio {
  margin: 0;
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

.career li {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
}

.career__period {
  font-family: var(--font-mono);
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
  color: var(--brand-ink-muted);
  line-height: 1.7;
}

.skills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.skills__group h3 {
  margin: 0 0 10px;
  font-family: var(--font-mono);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: var(--step-0);
}

.skills__level {
  display: flex;
  gap: 3px;
}

.skills__level i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-line);
}

.skills__level i.is-on {
  background: var(--brand-accent);
}

@media (max-width: 640px) {
  .career li {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .skills {
    grid-template-columns: 1fr;
  }
}
</style>

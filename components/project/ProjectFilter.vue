<script setup lang="ts">
import type { CategoryFilter } from '~/composables/store/useProjectStore'

const props = defineProps<{
  modelValue: CategoryFilter
  counts: Record<string, number>
}>()

const emit = defineEmits<{ 'update:modelValue': [CategoryFilter] }>()

const filters: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'vue-nuxt', label: 'Vue · Nuxt' },
  { value: 'astro', label: 'Astro' },
  { value: 'publisher', label: '퍼블리싱' },
  { value: 'react', label: 'React' },
]

// 건수가 0인 분류는 노출하지 않는다. 빈 필터를 누르게 하지 않기 위함이다.
const visible = computed(() =>
  filters.filter((f) => f.value === 'all' || (props.counts[f.value] ?? 0) > 0),
)

const onSelect = (value: CategoryFilter) => emit('update:modelValue', value)
</script>

<template>
  <div class="filters" role="group" aria-label="프로젝트 분류 필터">
    <button
      v-for="f in visible"
      :key="f.value"
      type="button"
      class="chip"
      :aria-pressed="modelValue === f.value"
      @click="onSelect(f.value)"
    >
      {{ f.label }}
      <span class="chip__cnt">{{ counts[f.value] ?? 0 }}</span>
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--brand-line);
}

.chip {
  font-family: inherit;
  font-size: var(--step-0);
  font-weight: 500;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid var(--brand-line);
  background: var(--brand-surface);
  color: var(--brand-ink-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  border-color: var(--brand-accent);
  color: var(--brand-ink);
}

.chip[aria-pressed='true'] {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: var(--brand-accent-ink);
}

.chip__cnt {
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.7;
  margin-left: 6px;
}
</style>

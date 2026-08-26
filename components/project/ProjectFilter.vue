<script setup lang="ts">
import { UiTab } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
import type { CategoryFilter } from '~/composables/store/useProjectStore'

const props = defineProps<{
  modelValue: CategoryFilter
  counts: Record<string, number>
}>()

const emit = defineEmits<{ 'update:modelValue': [CategoryFilter] }>()

const filters: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'vue-nuxt', label: 'Vue · Nuxt' },
  { value: 'astro', label: 'Astro' },
  { value: 'publisher', label: 'Publishing' },
  { value: 'react', label: 'React' },
]

// 건수가 0인 분류는 노출하지 않는다. 빈 필터를 누르게 하지 않기 위함이다.
// UiTab의 count가 칩 안의 건수 배지를 대신한다.
const tabs = computed<TabItem[]>(() =>
  filters
    .filter((f) => f.value === 'all' || (props.counts[f.value] ?? 0) > 0)
    .map((f) => ({
      label: f.label,
      value: f.value,
      count: props.counts[f.value] ?? 0,
    })),
)

const onTabChange = (value: string) => emit('update:modelValue', value as CategoryFilter)
</script>

<template>
  <UiTab
    :model-value="modelValue"
    :tabs="tabs"
    size="md"
    align="left"
    aria-label="프로젝트 분류 필터"
    @update:model-value="onTabChange"
  />
</template>

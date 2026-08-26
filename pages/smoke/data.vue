<!-- pages/smoke/data.vue -->
<script setup lang="ts">
import {
  UiFileList,
  UiFileUpload,
  UiChart,
  UiMarkdownEditor,
  UiDatePicker,
  UiDateRangePicker,
  UiSelect,
  UiMultiSelect,
  UiTab,
  UiCalendarMonth,
} from '@leechanyong/ispark-ui'
import type {
  FileItem,
  SelectOption,
  MultiSelectOption,
  TabItem,
  DateRange,
} from '@leechanyong/ispark-ui'
import type { DateValue } from '@internationalized/date'

// ===== 파일 =====
// FileItem은 { id, filename, path, mimetype } 이다.
// mimetype이 없으면 UiFileList가 내부에서 startsWith를 호출하다 SSR에서 죽는다.
const files: FileItem[] = [
  {
    id: 1,
    filename: '웹접근성인증서.pdf',
    path: '/documents/web-accessibility.pdf',
    mimetype: 'application/pdf',
  },
]

// UiFileList의 getUrl은 필수 prop이다. 컴포넌트가 t.getUrl(path)를 무조건 호출하므로
// 빠뜨리면 SSR에서 "getUrl is not a function"으로 500이 난다.
// 실제 서비스에서는 Supabase Storage 공개 URL을 만들어 반환하게 된다.
const getFileUrl = (path: string) => path

// ===== 셀렉트 =====
const category = ref('vue-nuxt')
const categoryOptions: SelectOption[] = [
  { label: 'Vue · Nuxt', value: 'vue-nuxt' },
  { label: 'Astro', value: 'astro' },
]

const tags = ref<string[]>([])
const tagOptions: MultiSelectOption[] = [
  { label: 'Vue3', value: 'vue3' },
  { label: 'Nuxt3', value: 'nuxt3' },
]

// ===== 날짜 =====
// 날짜 컴포넌트는 @internationalized/date의 DateValue를 받는다. 문자열이 아니다.
const startedOn = shallowRef<DateValue | undefined>(undefined)
const range = shallowRef<DateRange>({ start: undefined, end: undefined })

// ===== 탭 =====
const activeTab = ref('all')
const tabList: TabItem[] = [
  { label: '전체', value: 'all' },
  { label: '진행중', value: 'ongoing' },
]

// ===== 차트 =====
// UiChart는 data가 아니라 config(Chart.js 설정 객체)를 받는다.
const chartConfig = {
  labels: ['월', '화'],
  datasets: [{ label: '방문', data: [12, 19] }],
}

// ===== 마크다운 =====
const content = ref('')
</script>

<template>
  <main data-smoke="data" style="padding: 32px; display: grid; gap: 24px">
    <h1>Data 그룹</h1>

    <section data-c="UiFileList">
      <h2>첨부 파일</h2>
      <UiFileList :files="files" :get-url="getFileUrl" />
    </section>

    <section data-c="UiFileUpload">
      <h2>파일 업로드</h2>
      <UiFileUpload accept=".pdf" />
    </section>

    <section data-c="UiSelect">
      <h2>단일 선택</h2>
      <UiSelect v-model="category" :options="categoryOptions" />
    </section>

    <section data-c="UiMultiSelect">
      <h2>다중 선택</h2>
      <UiMultiSelect v-model="tags" :options="tagOptions" />
    </section>

    <section data-c="UiDatePicker">
      <h2>날짜 선택</h2>
      <UiDatePicker v-model="startedOn" />
    </section>

    <section data-c="UiDateRangePicker">
      <h2>기간 선택</h2>
      <UiDateRangePicker v-model="range" />
    </section>

    <section data-c="UiTab">
      <h2>탭</h2>
      <UiTab v-model="activeTab" :tabs="tabList" />
    </section>

    <section data-c="UiCalendarMonth">
      <h2>월 캘린더</h2>
      <UiCalendarMonth :year="2026" :month="8" :events="[]" />
    </section>

    <!-- Chart.js는 canvas 의존이라 서버 렌더를 기대하지 않는다 -->
    <section data-c="UiChart">
      <h2>방문 통계</h2>
      <ClientOnly>
        <UiChart type="bar" :config="chartConfig" />
        <template #fallback><div>차트 로딩 중…</div></template>
      </ClientOnly>
    </section>

    <!-- TipTap은 DOM 의존이라 서버 렌더를 기대하지 않는다 -->
    <section data-c="UiMarkdownEditor">
      <h2>상세 내용</h2>
      <ClientOnly>
        <UiMarkdownEditor v-model="content" />
        <template #fallback><div>에디터 로딩 중…</div></template>
      </ClientOnly>
    </section>
  </main>
</template>

<script setup lang="ts">
import { UiTab, UiBadge, UiEmpty, UiModal } from '@leechanyong/ispark-ui'
import type { TabItem } from '@leechanyong/ispark-ui'
import type { Archive, ArchiveDocType } from '~/types/database'
import type { DocTypeFilter } from '~/composables/store/useArchiveStore'

const {
  archiveList,
  activeDocType,
  selectedArchive,
  filteredList,
  docTypeCounts,
  handleSelectArchiveList,
  onDocTypeChange,
  openViewer,
  closeViewer,
} = useArchiveStore()

await useAsyncData('archive/list', async () => {
  await handleSelectArchiveList()
  return true
})

const DOC_TYPES: ArchiveDocType[] = ['증명서', '포트폴리오', '기타']

// 건수가 0인 분류는 노출하지 않는다. 빈 필터를 누르게 하지 않기 위함이다.
const tabs = computed<TabItem[]>(() => [
  { label: '전체', value: 'all', count: docTypeCounts.value.all ?? 0 },
  ...DOC_TYPES.filter((t) => (docTypeCounts.value[t] ?? 0) > 0).map((t) => ({
    label: t,
    value: t,
    count: docTypeCounts.value[t] ?? 0,
  })),
])

const onTabChange = (value: string) => onDocTypeChange(value as DocTypeFilter)

/*
  모달은 v-model:open 을 쓴다. 스토어의 selectedArchive 하나로 열림 여부와
  대상 자료를 함께 관리하므로, 닫힘 신호가 오면 선택을 비운다.
*/
const isViewerOpen = computed({
  get: () => Boolean(selectedArchive.value),
  set: (v: boolean) => {
    if (!v) closeViewer()
  },
})

const viewerUrl = computed(() => publicFileUrl('documents', selectedArchive.value?.file_path))
const thumbUrl = (a: Archive) => publicFileUrl('thumbnails', a.thumbnail_path)

/** 2023-04-01 → 2023.04 */
const formatIssued = (d: string | null) => (d ? d.slice(0, 7).replace('-', '.') : null)

useSeoMeta({
  title: "Archive — Cy's Code Canvas",
  description: '웹 접근성·품질 인증서와 심사 결과서, 발표 자료.',
})
</script>

<template>
  <div>
    <LayoutPageHeader
      eyebrow="Proof of work"
      title="Archive"
      description="웹 접근성·품질 인증서와 심사 결과서, 발표 자료."
    />

    <div class="page">
      <UiTab
        v-if="archiveList.length"
        :model-value="activeDocType"
        :tabs="tabs"
        size="md"
        align="left"
        aria-label="자료 분류 필터"
        @update:model-value="onTabChange"
      />

      <p v-if="archiveList.length" class="page__count">{{ filteredList.length }}건</p>

      <ul v-if="filteredList.length" class="grid">
        <li v-for="(a, i) in filteredList" :key="a.id" v-reveal="{ delay: Math.min(i, 5) * 60 }">
          <!--
            카드 전체가 버튼이다. 파일 링크를 그대로 노출하지 않고 모달 뷰어로 연다
            — 원본 PDF 는 뷰어 안에서만 로드한다는 설계를 따른다.
          -->
          <button type="button" class="doc" @click="openViewer(a)">
            <span class="doc__thumb">
              <img v-if="thumbUrl(a)" :src="thumbUrl(a)!" :alt="`${a.title} 미리보기`" loading="lazy" />
              <span v-else class="doc__glyph" aria-hidden="true">PDF</span>
            </span>

            <span class="doc__body">
              <UiBadge size="xs" :variant="a.doc_type === '증명서' ? 'primary' : 'default'">
                {{ a.doc_type }}
              </UiBadge>

              <span class="doc__title">{{ a.title }}</span>

              <span v-if="a.issuer || a.issued_on" class="doc__meta">
                <span v-if="a.issuer">{{ a.issuer }}</span>
                <span v-if="a.issuer && a.issued_on" aria-hidden="true">·</span>
                <span v-if="a.issued_on">{{ formatIssued(a.issued_on) }}</span>
              </span>
            </span>
          </button>
        </li>
      </ul>

      <div v-else class="page__empty">
        <UiEmpty
          v-if="archiveList.length"
          icon="icon-search"
          title="해당 분류의 자료가 없습니다"
          description="다른 분류를 선택해 보세요."
        />
        <UiEmpty
          v-else
          title="아직 공개된 자료가 없습니다"
          description="인증서와 발표 자료가 정리되는 대로 이곳에 올라옵니다."
        />
      </div>
    </div>

    <UiModal
      v-model:open="isViewerOpen"
      size="xl"
      :title="selectedArchive?.title ?? '자료 보기'"
      :description="selectedArchive?.description ?? undefined"
    >
      <div v-if="viewerUrl" class="viewer">
        <!--
          브라우저 내장 PDF 뷰어를 쓴다. pdf.js 를 넣으면 번들이 크게 늘어나는데
          여기서 필요한 건 "읽을 수 있게 띄우기" 뿐이다.
        -->
        <iframe :src="viewerUrl" :title="`${selectedArchive?.title} 문서 뷰어`" class="viewer__frame" />

        <!-- iframe PDF 를 막는 브라우저(주로 모바일)를 위한 탈출구 -->
        <p class="viewer__fallback">
          문서가 보이지 않으면
          <a :href="viewerUrl" target="_blank" rel="noopener noreferrer">새 탭에서 열기</a>
        </p>
      </div>

      <p v-else class="viewer__missing">파일 경로가 없어 문서를 불러올 수 없습니다.</p>
    </UiModal>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 24px 20px;
}

.page__count {
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
  margin: 18px 0 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 탭이 이미 아래쪽 구분선을 갖고 있어 여기서 또 그으면 줄이 두 개가 된다 */
.page__empty {
  padding: 32px 0 48px;
}

/* ===== 카드 ===== */
.doc {
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  transition: border-color 0.15s, transform 0.15s;
}

.doc:hover {
  border-color: var(--brand-accent);
  transform: translateY(-2px);
}

.doc:focus-visible {
  outline: 2px solid var(--brand-focus);
  outline-offset: 2px;
}

.doc__thumb {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  border-bottom: 1px solid var(--brand-line);
  background: color-mix(in oklab, var(--brand-line) 30%, var(--brand-surface));
  overflow: hidden;
}

.doc__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

/* 썸네일이 없을 때. 빈 회색 상자보다 무엇인지 말해주는 편이 낫다. */
.doc__glyph {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--brand-ink-muted);
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  padding: 7px 14px;
  border-radius: 8px;
}

.doc__body {
  display: grid;
  gap: 7px;
  justify-items: start;
  align-content: start;
  padding: 15px 16px 17px;
}

.doc__title {
  font-size: var(--step-1);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.012em;
}

.doc__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
}

/* ===== 뷰어 ===== */
.viewer__frame {
  width: 100%;
  height: min(72vh, 900px);
  border: 1px solid var(--brand-line);
  border-radius: 8px;
  background: var(--brand-ground);
}

.viewer__fallback,
.viewer__missing {
  margin: 10px 0 0;
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
}

.viewer__fallback a {
  color: var(--brand-accent);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

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
}, { getCachedData: () => undefined })

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

const route = useRoute()
watch(() => [route.query.document, archiveList.value] as const, () => {
  const doc = archiveList.value.find(item => String(item.id) === route.query.document)
  if (doc) openViewer(doc)
}, { immediate: true })
const viewerUrl = computed(() => publicFileUrl('documents', selectedArchive.value?.file_path))
const thumbUrl = (a: Archive) => archivePreviewFor(a.file_path)?.src ?? publicFileUrl('thumbnails', a.thumbnail_path)
const failedThumbnails = ref(new Set<string>())

/** 2023-04-01 → 2023.04 */
const formatIssued = (d: string | null) => (d ? d.slice(0, 7).replace('-', '.') : null)

useSeoMeta({
  title: "자료실 — 이찬용",
  description: '웹 접근성·품질 인증서와 심사 결과서, 발표 자료.',
})
</script>

<template>
  <div class="archive-page">
    <LayoutPageHeader
      eyebrow="Proof of work"
      title="자료실"
      description="웹 접근성·품질 인증서와 심사 결과서, 발표 자료."
    />

    <div class="page">
      <div class="archive-toolbar">
      <UiTab
        v-if="archiveList.length"
        :model-value="activeDocType"
        :tabs="tabs"
        size="md"
        align="left"
        aria-label="자료 분류 필터"
        @update:model-value="onTabChange"
      />
      <NuxtLink to="/about#credentials" class="archive-back">소개·경력으로 ↗</NuxtLink>
      </div>
      <p v-if="archiveList.length" class="page__count"><span>DOCUMENT COLLECTION</span><span>{{ filteredList.length }}건의 기록</span></p>

      <ul v-if="filteredList.length" class="grid">
        <li v-for="a in filteredList" :key="a.id">
          <!--
            카드 전체가 버튼이다. 파일 링크를 그대로 노출하지 않고 모달 뷰어로 연다
            — 원본 PDF 는 뷰어 안에서만 로드한다는 설계를 따른다.
          -->
          <button type="button" class="doc" @click="openViewer(a)">
            <span class="doc__thumb">
              <img v-if="thumbUrl(a) && !failedThumbnails.has(a.id)" :src="thumbUrl(a)!" :alt="`${a.title} 첫 페이지`" loading="lazy" @error="failedThumbnails.add(a.id)" />
              <span v-else class="doc__glyph" aria-hidden="true"><span>PDF</span><i /><i /><i /></span>
              <span class="doc__file-label">PDF <template v-if="archivePreviewFor(a.file_path)">· {{ archivePreviewFor(a.file_path)!.pages }}P</template></span>
              <span class="doc__open" aria-hidden="true">문서 읽기 ↗</span>
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
.archive-page :deep(.ph__inner) { padding-top:20px; padding-bottom:12px; }
.archive-page :deep(.ph__title) { font-size:clamp(28px,3vw,40px); }
.archive-page :deep(.ph__desc) { margin-top:8px; }
.archive-toolbar { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.archive-toolbar :deep(.ui-tab) { flex:1; min-width:0; width:auto; overflow-x:auto; overflow-y:hidden; }
.archive-toolbar :deep(.ui-tab-inner) { width:max-content; min-width:100%; }
.archive-toolbar :deep(.ui-tab-item) { flex-shrink:0; white-space:nowrap; }
.archive-back { flex-shrink:0; display:flex; align-items:center; min-height:44px; font-size:12px; color:var(--brand-ink-muted); text-decoration:none; }
.archive-back:hover { color:var(--brand-accent); }
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 24px 20px;
}

.page__count {
  font-size: var(--step--1);
  color: var(--brand-ink-muted);
  font-variant-numeric: tabular-nums;
  margin: 12px 0;
  display:flex;
  justify-content:space-between;
  font-size:10px;
  letter-spacing:.05em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 18px;
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
  background: transparent;
  border: 0;
  border-bottom:1px solid var(--brand-line);
  border-radius: 0;
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
  border: 1px solid var(--brand-line);
  background: radial-gradient(ellipse at 20% 0%,var(--brand-surface),transparent 70%),color-mix(in oklab, var(--brand-line) 35%, var(--brand-ground));
  overflow: hidden;
}

.doc__thumb img {
  position:absolute;
  top:16px;
  left:20px;
  width:calc(100% - 40px);
  height:calc(100% - 48px);
  object-fit:contain;
  filter:drop-shadow(3px 5px 5px #282b3024);
  transition:transform .2s ease;
}
.doc:hover .doc__thumb img,.doc:focus-visible .doc__thumb img { transform:translateY(-3px); }
.doc__file-label,.doc__open { position:absolute; bottom:10px; font-size:9px; letter-spacing:.05em; color:var(--brand-ink-muted); }
.doc__file-label { left:12px; }.doc__open { right:12px; }

/* 썸네일이 없을 때. 빈 회색 상자보다 무엇인지 말해주는 편이 낫다. */
.doc__glyph {
  display:grid;
  align-content:start;
  gap:10px;
  width:40%;
  height:65%;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--brand-ink-muted);
  background: var(--brand-surface);
  border: 1px solid var(--brand-line);
  padding: 7px 14px;
  border-radius: 0;
}
.doc__glyph i { display:block; height:2px; background:var(--brand-line); }

.doc__body {
  display: grid;
  gap: 7px;
  justify-items: start;
  align-content: start;
  padding: 12px 0 16px;
}

.doc__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.55;
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

@media (max-width: 1350px) { .grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .archive-toolbar { flex-wrap:wrap; gap:0; }.archive-toolbar :deep(.ui-tab) { flex-basis:100%; }.archive-back { min-height:32px; margin-left:auto; }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

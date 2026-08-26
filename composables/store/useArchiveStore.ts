import type { Archive, ArchiveDocType } from '~/types/database'

export type DocTypeFilter = ArchiveDocType | 'all'

export const useArchiveStore = () => {
  const { fetchArchiveList } = useArchiveApi()

  // ===== 상태 변수 =====
  // 모듈 스코프 ref 는 SSR 에서 요청 간 상태가 공유된다. useState 로 요청별 격리.
  const archiveList = useState<Archive[]>('archive/list', () => [])
  const activeDocType = useState<DocTypeFilter>('archive/docType', () => 'all')
  const selectedArchive = useState<Archive | null>('archive/selected', () => null)

  // ===== 조회 =====
  const handleSelectArchiveList = async () => {
    archiveList.value = (await fetchArchiveList()) ?? []
  }

  // ===== 파생 =====
  /*
    분류 필터는 서버를 다시 타지 않는다. 자료가 수십 건 규모라 왕복할 이유가 없고,
    프로젝트 목록과 달리 분류가 고정 3종이라 전량을 들고 있는 편이 단순하다.
  */
  const filteredList = computed(() =>
    activeDocType.value === 'all'
      ? archiveList.value
      : archiveList.value.filter((a) => a.doc_type === activeDocType.value),
  )

  const docTypeCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = { all: archiveList.value.length }
    for (const a of archiveList.value) {
      counts[a.doc_type] = (counts[a.doc_type] ?? 0) + 1
    }
    return counts
  })

  // ===== 이벤트 =====
  const onDocTypeChange = (docType: DocTypeFilter) => {
    activeDocType.value = docType
  }

  const openViewer = (archive: Archive) => {
    selectedArchive.value = archive
  }

  const closeViewer = () => {
    selectedArchive.value = null
  }

  return {
    archiveList,
    activeDocType,
    selectedArchive,
    filteredList,
    docTypeCounts,
    handleSelectArchiveList,
    onDocTypeChange,
    openViewer,
    closeViewer,
  }
}

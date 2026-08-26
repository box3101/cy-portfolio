/** '2025-03-01' → '2025.03' */
const toYearMonth = (iso: string): string => {
  const [y, m] = iso.split('-')
  return `${y}.${m}`
}

/**
 * 프로젝트·경력 기간 표기.
 * period_end 가 null 이면 진행중으로 본다 (DB에서 NULL = 진행중 규약).
 */
export const formatPeriod = (start: string, end: string | null): string =>
  end ? `${toYearMonth(start)} — ${toYearMonth(end)}` : `${toYearMonth(start)} — 진행중`

export const isOngoing = (end: string | null): boolean => end === null

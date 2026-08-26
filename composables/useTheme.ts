type Theme = 'light' | 'dark'

/**
 * 테마 토글.
 *
 * 서버에서는 사용자의 OS 설정을 알 수 없으므로 아무것도 스탬프하지 않는다.
 * 그 상태에서는 tokens.css의 prefers-color-scheme 미디어쿼리가 동작하고,
 * 사용자가 토글하면 data-theme 속성이 그것을 이긴다.
 */
export const useTheme = () => {
  const theme = useState<Theme | null>('theme', () => null)

  const applyTheme = (next: Theme) => {
    theme.value = next
    if (!import.meta.client) return

    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // 프라이빗 모드 등에서 실패할 수 있다. 테마는 부가 기능이므로 무시한다.
    }
  }

  /** 저장된 선택을 복원한다. 없으면 OS 설정을 따르도록 스탬프하지 않는다. */
  const restoreTheme = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') applyTheme(saved)
    } catch {
      // 무시
    }
  }

  const isDark = (): boolean => {
    if (theme.value) return theme.value === 'dark'
    if (!import.meta.client) return false
    return matchMedia('(prefers-color-scheme: dark)').matches
  }

  const toggleTheme = () => {
    applyTheme(isDark() ? 'light' : 'dark')
  }

  return { theme, applyTheme, restoreTheme, toggleTheme, isDark }
}

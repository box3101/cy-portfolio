type Theme = 'light' | 'dark'

/**
 * 테마 토글.
 *
 * 이 사이트는 라이트가 기본이다(tokens.css의 :root = 라이트).
 * 스탬프가 없으면 라이트다. 사용자가 토글하면 data-theme="dark" 가 붙는다.
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
    // 스탬프가 없으면 항상 라이트다. OS 설정은 따르지 않는다.
    return false
  }

  const toggleTheme = () => {
    applyTheme(isDark() ? 'light' : 'dark')
  }

  return { theme, applyTheme, restoreTheme, toggleTheme, isDark }
}

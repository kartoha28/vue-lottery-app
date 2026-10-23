import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>(
    (localStorage.getItem('lottery_theme') as ThemeMode) || 'light',
  )

  function applyTheme(theme: ThemeMode): void {
    currentTheme.value = theme
    localStorage.setItem('lottery_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('app-dark-theme')
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.classList.remove('app-dark-theme')
      document.documentElement.setAttribute('data-bs-theme', 'light')
    }
  }

  function toggleTheme(): void {
    applyTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme(): void {
    applyTheme(currentTheme.value)
  }

  return {
    currentTheme,
    toggleTheme,
    applyTheme,
    initTheme,
  }
})

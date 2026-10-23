<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Logo } from '@/widgets/app-header'
import { useThemeStore } from '@/entities/theme'
import { AppButton } from '@/shared/ui'

const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<template>
  <div class="auth-layout">
    <div class="auth-top-bar">
      <Logo />
      <AppButton
        variant="outline-secondary"
        size="sm"
        class="theme-toggle-btn"
        :title="currentTheme === 'light' ? 'Перемкнути на темну тему' : 'Перемкнути на світлу тему'"
        @click="toggleTheme"
      >
        <span v-if="currentTheme === 'light'">🌙 Темна</span>
        <span v-else>☀️ Світла</span>
      </AppButton>
    </div>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f1f5f9;
  transition: background-color 0.2s ease;
}

:global(html.app-dark-theme) .auth-layout {
  background-color: #121212;
}

.auth-top-bar {
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>

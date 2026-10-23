<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/entities/theme'
import { AppButton } from '@/shared/ui'
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'

const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <Logo />
      <div class="header-right">
        <AppNavigation />
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
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: var(--p-surface-0, #ffffff);
  border-bottom: 1px solid var(--p-surface-200, #dee2e6);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.theme-toggle-btn {
  font-size: 0.825rem;
}
</style>

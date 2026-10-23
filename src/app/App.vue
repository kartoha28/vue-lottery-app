<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useSessionStore } from '@/entities/session'
import { useThemeStore } from '@/entities/theme'

const route = useRoute()
const sessionStore = useSessionStore()
const themeStore = useThemeStore()

const currentLayout = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : DefaultLayout
})

onMounted(() => {
  themeStore.initTheme()
  if (sessionStore.isAuthenticated) {
    sessionStore.fetchCurrentUser()
  }
})
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

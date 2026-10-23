<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { AppButton } from '@/shared/ui'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async (): Promise<void> => {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <AppButton
    variant="outline-danger"
    size="sm"
    @click="handleLogout"
  >
    Вийти
  </AppButton>
</template>

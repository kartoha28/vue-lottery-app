<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton, useAppToast } from '@/shared/ui'

const authStore = useSessionStore()
const router = useRouter()
const toast = useAppToast()

const handleLogout = async (): Promise<void> => {
  authStore.logout()
  toast.info('Ви успішно вийшли з системи')
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

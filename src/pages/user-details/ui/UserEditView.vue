<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import type { CreateUserDto, User } from '@/entities/user'

const props = defineProps<{
  id: string
}>()

const usersStore = useUsersStore()
const router = useRouter()
const user = ref<User | null>(null)

onMounted(async () => {
  const numericId = Number(props.id)
  if (!Number.isFinite(numericId)) return
  try {
    user.value = await usersStore.getUserById(numericId)
  } catch {
    user.value = null
  }
})

const handleUpdate = async (dto: CreateUserDto): Promise<void> => {
  const numericId = Number(props.id)
  await usersStore.updateUser(numericId, dto)
  await router.push(`/users/${numericId}`)
}

const handleCancel = async (): Promise<void> => {
  await router.push(`/users/${props.id}`)
}
</script>

<template>
  <div class="edit-user-panel">
    <h2 class="edit-title">Редагування даних користувача</h2>

    <div v-if="user">
      <UserForm
        :initial-data="user"
        submit-label="Оновити дані"
        :is-submitting="usersStore.isLoading"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-user-panel {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
}

.edit-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #212529;
}
</style>

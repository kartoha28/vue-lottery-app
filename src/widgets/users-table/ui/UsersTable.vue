<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { User } from '@/entities/user'
import { AppButton } from '@/shared/ui'

defineProps<{
  users: User[]
  isLoading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>()
</script>

<template>
  <div class="users-table-widget">
    <div v-if="isLoading" class="state-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="state-text">Завантаження користувачів...</p>
    </div>

    <div v-else-if="error" class="state-container alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="users.length === 0" class="state-container alert alert-info">
      Користувачів не знайдено.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle custom-table">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Аватар</th>
            <th>Ім'я та прізвище</th>
            <th>Email</th>
            <th>Роль / Компанія</th>
            <th class="text-end">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <img
                :src="user.image || 'https://via.placeholder.com/40'"
                :alt="user.firstName"
                class="user-avatar"
              />
            </td>
            <td>
              <RouterLink :to="{ name: 'user-details', params: { id: user.id } }" class="user-link">
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
              </RouterLink>
              <div class="text-muted small">@{{ user.username }}</div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge bg-secondary me-1">{{ user.role || 'user' }}</span>
              <span v-if="user.company?.name" class="text-muted small">{{ user.company.name }}</span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <RouterLink
                  :to="{ name: 'user-details', params: { id: user.id } }"
                  class="btn btn-outline-info"
                  title="Переглянути"
                >
                  Деталі
                </RouterLink>
                <AppButton
                  variant="outline-primary"
                  size="sm"
                  title="Редагувати"
                  @click="emit('edit', user)"
                >
                  Редагувати
                </AppButton>
                <AppButton
                  variant="outline-danger"
                  size="sm"
                  title="Видалити"
                  @click="emit('delete', user)"
                >
                  Видалити
                </AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.users-table-widget {
  background: #ffffff;
  border-radius: 6px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f1f3f5;
  border: 1px solid #dee2e6;
}

.user-link {
  color: #212529;
  text-decoration: none;

  &:hover {
    color: #0d6efd;
    text-decoration: underline;
  }
}

.state-container {
  padding: 3rem 1.5rem;
  text-align: center;
}

.state-text {
  margin-top: 0.75rem;
  color: #6c757d;
  font-size: 0.95rem;
}
</style>

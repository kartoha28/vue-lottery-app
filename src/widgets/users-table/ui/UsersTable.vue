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
    <div v-if="isLoading" class="state-container text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="state-text">Завантаження списку користувачів...</p>
    </div>

    <div v-else-if="error" class="state-container alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="table-responsive">
      <table class="table users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Користувач</th>
            <th>Username</th>
            <th>Вік / Стать</th>
            <th>Email</th>
            <th>Телефон</th>
            <th class="text-end">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">
              Користувачів за вашим запитом не знайдено
            </td>
          </tr>
          <tr v-for="u in users" :key="u.id">
            <td class="text-muted">#{{ u.id }}</td>
            <td>
              <RouterLink :to="`/users/${u.id}`" class="user-name-link">
                {{ u.firstName }} {{ u.lastName }}
              </RouterLink>
            </td>
            <td>
              <code>@{{ u.username }}</code>
            </td>
            <td>{{ u.age }} р. ({{ u.gender }})</td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone }}</td>
            <td class="text-end actions-cell">
              <RouterLink
                :to="`/users/${u.id}`"
                class="btn btn-sm btn-outline-secondary action-btn"
              >
                Деталі
              </RouterLink>
              <RouterLink
                :to="`/users/${u.id}/edit`"
                class="btn btn-sm btn-outline-primary action-btn"
              >
                Редагувати
              </RouterLink>
              <AppButton
                size="sm"
                variant="outline-danger"
                class="action-btn"
                @click="emit('delete', u)"
              >
                Видалити
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.users-table-widget {
  background: transparent;
}

.user-name-link {
  font-weight: 600;
  color: #0d6efd;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  margin-left: 0.35rem;
}

.state-container {
  padding: 2.5rem 1rem;
}

.state-text {
  margin-top: 0.75rem;
  color: #6c757d;
  font-size: 0.95rem;
}
</style>

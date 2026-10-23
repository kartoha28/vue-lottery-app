<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users.store'
import type { User } from '@/entities/user'

const props = defineProps<{
  id: string
}>()

const usersStore = useUsersStore()
const route = useRoute()
const user = ref<User | null>(null)

const loadUser = async (): Promise<void> => {
  const numericId = Number(props.id)
  if (!Number.isFinite(numericId)) return
  try {
    user.value = await usersStore.getUserById(numericId)
  } catch {
    user.value = null
  }
}

onMounted(loadUser)

// Оновлюємо дані при зміні id або після повернення з вкладеного маршруту /edit
watch(
  () => [props.id, route.fullPath],
  () => {
    loadUser()
  },
)
</script>

<template>
  <section class="content-card user-details-view">
    <div class="top-nav mb-3">
      <RouterLink to="/users" class="btn btn-sm btn-outline-secondary">
        &#8592; Назад до списку користувачів
      </RouterLink>
    </div>

    <div v-if="usersStore.error" class="alert alert-danger" role="alert">
      {{ usersStore.error }}
    </div>

    <div v-if="usersStore.isLoading && !user" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
    </div>

    <div v-else-if="user" class="user-profile-box">
      <div class="profile-header">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="`${user.firstName} ${user.lastName}`"
          class="profile-avatar"
        />
        <div v-else class="profile-avatar-fallback">
          {{ user.firstName[0] }}{{ user.lastName[0] }}
        </div>

        <div class="profile-main-info">
          <h1 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="profile-username">
            <code>@{{ user.username }}</code> &bull; ID #{{ user.id }}
          </p>
        </div>

        <div class="profile-actions ms-auto">
          <RouterLink
            v-if="!route.path.endsWith('/edit')"
            :to="`/users/${user.id}/edit`"
            class="btn btn-primary btn-sm"
          >
            Редагувати користувача
          </RouterLink>
        </div>
      </div>

      <div class="row g-3 profile-grid mt-2">
        <div class="col-sm-6 col-md-4">
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ user.email }}</span>
          </div>
        </div>
        <div class="col-sm-6 col-md-4">
          <div class="info-item">
            <span class="info-label">Телефон</span>
            <span class="info-value">{{ user.phone }}</span>
          </div>
        </div>
        <div class="col-sm-6 col-md-4">
          <div class="info-item">
            <span class="info-label">Вік / Стать</span>
            <span class="info-value">{{ user.age }} років ({{ user.gender }})</span>
          </div>
        </div>
      </div>

      <!-- Вкладений маршрут редагування (/users/:id/edit) -->
      <div class="nested-route-container mt-4">
        <RouterView />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.profile-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d6efd;
}

.profile-avatar-fallback {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #212529;
}

.profile-username {
  margin: 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.info-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6c757d;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #212529;
}
</style>

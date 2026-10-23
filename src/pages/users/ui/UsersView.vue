<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { AppButton, AppModal } from '@/shared/ui'
import { SearchBar } from '@/features/user-search'
import { UserForm } from '@/features/user-form'
import { WinnersBlock } from '@/entities/lottery'
import type { Winner } from '@/entities/lottery/model/types'
import type { CreateUserDto, User } from '@/entities/user'

const usersStore = useUsersStore()
const route = useRoute()
const router = useRouter()

const LIMIT = 10

// Стан переможців лотереї
const winners = ref<Winner[]>([])

// Query-параметри з URL: page та q
const currentPage = computed(() => {
  const pageParam = Number(route.query.page)
  return Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
})

const currentSearch = computed(() => {
  return typeof route.query.q === 'string' ? route.query.q : ''
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(usersStore.total / LIMIT))
})

// Завантаження даних при зміні page або q в URL
watch(
  () => [currentPage.value, currentSearch.value] as const,
  async ([page, q]) => {
    const skip = (page - 1) * LIMIT
    await usersStore.fetchUsers({ limit: LIMIT, skip, q })
  },
  { immediate: true },
)

// Пошук із збереженням у query-параметрах URL
const handleFilterByName = async (query: string): Promise<void> => {
  if (query === currentSearch.value) return
  await router.push({
    query: {
      ...(query ? { q: query } : {}),
      page: '1',
    },
  })
}

// Зміна сторінки пагінації в query-параметрах URL
const goToPage = async (page: number): Promise<void> => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  await router.push({
    query: {
      ...route.query,
      page: String(page),
    },
  })
}

// Лотерея серед завантажених користувачів
const eligibleUsers = computed(() => {
  const winnerIds = new Set(winners.value.map((w) => w.id))
  return usersStore.users.filter((u) => !winnerIds.has(String(u.id)))
})

const canPickWinner = computed(() => {
  return winners.value.length < 3 && eligibleUsers.value.length > 0
})

const handlePickWinner = (): void => {
  if (!canPickWinner.value) return
  const pool = eligibleUsers.value
  const randomIndex = Math.floor(Math.random() * pool.length)
  const selected = pool[randomIndex]
  if (selected) {
    winners.value.push({
      id: String(selected.id),
      name: `${selected.firstName} ${selected.lastName}`,
      email: selected.email,
    })
  }
}

const handleRemoveWinner = (id: string): void => {
  winners.value = winners.value.filter((w) => w.id !== id)
}

// Створення нового користувача
const isCreateModalOpen = ref(false)

const handleCreateUser = async (dto: CreateUserDto): Promise<void> => {
  await usersStore.createUser(dto)
  isCreateModalOpen.value = false
}

// Видалення користувача
const isDeleteModalOpen = ref(false)
const userToDelete = ref<User | null>(null)

const openDeleteModal = (user: User): void => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const closeDeleteModal = (): void => {
  isDeleteModalOpen.value = false
  userToDelete.value = null
}

const confirmDeleteUser = async (): Promise<void> => {
  if (!userToDelete.value) return
  const id = userToDelete.value.id
  await usersStore.deleteUser(id)
  winners.value = winners.value.filter((w) => w.id !== String(id))
  closeDeleteModal()
}
</script>

<template>
  <section class="content-card users-view">
    <!-- Блок переможців лотереї -->
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <!-- Заголовок та кнопка створення -->
    <div class="users-header">
      <div>
        <h1 class="section-title">Список учасників (DummyJSON Users)</h1>
        <p class="section-subtitle">
          Всього знайдено: <strong>{{ usersStore.total }}</strong> | Сторінка
          <strong>{{ currentPage }}</strong> з <strong>{{ totalPages }}</strong>
        </p>
      </div>
      <AppButton variant="primary" @click="isCreateModalOpen = true">
        + Додати користувача
      </AppButton>
    </div>

    <!-- Поле пошуку (синхронізоване з ?q=...) -->
    <SearchBar :initial-query="currentSearch" @filter-by-name="handleFilterByName" />

    <!-- Помилка запиту до API -->
    <div v-if="usersStore.error" class="alert alert-danger" role="alert">
      {{ usersStore.error }}
    </div>

    <!-- Стан завантаження -->
    <div v-if="usersStore.isLoading" class="loading-box text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="mt-2 text-muted mb-0">Завантаження списку користувачів...</p>
    </div>

    <!-- Таблиця користувачів -->
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
          <tr v-if="usersStore.users.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">
              Користувачів за вашим запитом не знайдено
            </td>
          </tr>
          <tr v-for="u in usersStore.users" :key="u.id">
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
                @click="openDeleteModal(u)"
              >
                Видалити
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагінація (limit / skip, синхронізована з ?page=...) -->
    <nav v-if="totalPages > 1" aria-label="Users pagination" class="pagination-bar">
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <button
            type="button"
            class="page-link"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Попередня
          </button>
        </li>
        <li
          v-for="p in totalPages"
          :key="p"
          class="page-item"
          :class="{ active: p === currentPage }"
        >
          <button type="button" class="page-link" @click="goToPage(p)">
            {{ p }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <button
            type="button"
            class="page-link"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Наступна
          </button>
        </li>
      </ul>
    </nav>

    <!-- Модальне вікно додавання нового користувача -->
    <AppModal
      :is-open="isCreateModalOpen"
      title="Додати нового користувача"
      @close="isCreateModalOpen = false"
    >
      <template #body>
        <UserForm
          submit-label="Створити користувача"
          :is-submitting="usersStore.isLoading"
          @submit="handleCreateUser"
          @cancel="isCreateModalOpen = false"
        />
      </template>
    </AppModal>

    <!-- Модальне вікно підтвердження видалення -->
    <AppModal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="closeDeleteModal"
    >
      <template #body>
        <p v-if="userToDelete" class="mb-0">
          Ви дійсно бажаєте видалити користувача
          <strong>"{{ userToDelete.firstName }} {{ userToDelete.lastName }}"</strong>
          ({{ userToDelete.email }})?
        </p>
      </template>
      <template #footer>
        <AppButton variant="secondary" size="sm" @click="closeDeleteModal">
          Ні
        </AppButton>
        <AppButton
          variant="danger"
          size="sm"
          :disabled="usersStore.isLoading"
          @click="confirmDeleteUser"
        >
          Так
        </AppButton>
      </template>
    </AppModal>
  </section>
</template>

<style scoped lang="scss">
.users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #212529;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.users-table {
  thead th {
    font-size: 0.875rem;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    white-space: nowrap;
  }

  tbody td {
    vertical-align: middle;
    font-size: 0.9rem;
  }
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
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.action-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.55rem;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  overflow-x: auto;
}
</style>

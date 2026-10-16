import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Локальний кеш для імітованих операцій POST, PUT, DELETE на DummyJSON
  const createdUsers = ref<User[]>([])
  const updatedUsersMap = ref<Record<number, UpdateUserDto>>({})
  const deletedUserIds = ref<Set<number>>(new Set())

  let nextLocalId = 1000

  function applyLocalStateToUser(user: User): User {
    const updates = updatedUsersMap.value[user.id]
    return updates ? { ...user, ...updates } : user
  }

  async function fetchUsers({
    limit = 10,
    skip = 0,
    q = '',
  }: { limit?: number; skip?: number; q?: string } = {}): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await ServiceProvider.users.getPaginated({ limit, skip, q })

      // Фільтруємо видалених та накладаємо локальні оновлення
      const apiUsers = response.users
        .filter((u) => !deletedUserIds.value.has(u.id))
        .map(applyLocalStateToUser)

      const queryLower = q.trim().toLowerCase()
      const matchingCreated = createdUsers.value
        .filter((u) => !deletedUserIds.value.has(u.id))
        .filter((u) => {
          if (!queryLower) return true
          const full = `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase()
          return full.includes(queryLower)
        })
        .map(applyLocalStateToUser)

      if (skip === 0 && matchingCreated.length > 0) {
        users.value = [...matchingCreated, ...apiUsers].slice(0, limit)
      } else {
        users.value = apiUsers
      }

      const deletedCount = deletedUserIds.value.size
      total.value = Math.max(
        0,
        response.total + matchingCreated.length - deletedCount,
      )
    } catch (e) {
      error.value = (e as Error).message || 'Не вдалося завантажити користувачів'
    } finally {
      isLoading.value = false
    }
  }

  async function getUserById(id: number): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const localCreated = createdUsers.value.find((u) => u.id === id)
      if (localCreated) {
        return applyLocalStateToUser(localCreated)
      }
      const apiUser = await ServiceProvider.users.getById(id)
      return applyLocalStateToUser(apiUser)
    } catch (e) {
      error.value = (e as Error).message || 'Не вдалося завантажити дані користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(dto: CreateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const created = await ServiceProvider.users.create(dto)
      const newUser: User = {
        ...created,
        ...dto,
        id: nextLocalId++,
      }
      createdUsers.value.unshift(newUser)
      users.value.unshift(newUser)
      total.value += 1
      return newUser
    } catch (e) {
      error.value = (e as Error).message || 'Помилка при створенні користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      // Якщо це локально створений юзер (якого немає на DummyJSON сервері), оновлюємо локально
      const localIndex = createdUsers.value.findIndex((u) => u.id === id)
      let updatedResponse: User
      if (localIndex !== -1) {
        const existing = createdUsers.value[localIndex]!
        updatedResponse = { ...existing, ...dto }
        createdUsers.value[localIndex] = updatedResponse
      } else {
        const apiUpdated = await ServiceProvider.users.update(id, dto)
        updatedResponse = { ...apiUpdated, ...dto, id }
      }

      updatedUsersMap.value[id] = {
        ...updatedUsersMap.value[id],
        ...dto,
      }

      const listIdx = users.value.findIndex((u) => u.id === id)
      if (listIdx !== -1) {
        users.value[listIdx] = { ...users.value[listIdx]!, ...dto }
      }

      return updatedResponse
    } catch (e) {
      error.value = (e as Error).message || 'Помилка при оновленні користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const isLocal = createdUsers.value.some((u) => u.id === id)
      if (!isLocal) {
        await ServiceProvider.users.delete(id)
      }
      deletedUserIds.value.add(id)
      createdUsers.value = createdUsers.value.filter((u) => u.id !== id)
      users.value = users.value.filter((u) => u.id !== id)
      total.value = Math.max(0, total.value - 1)
    } catch (e) {
      error.value = (e as Error).message || 'Помилка при видаленні користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }
})

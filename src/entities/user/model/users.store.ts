import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { CreateUserDto, UpdateUserDto, User } from './types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasUsers = computed(() => users.value.length > 0)

  // Локальний стан для імітованих операцій POST, PUT, DELETE на DummyJSON
  const createdUsers = ref<User[]>([])
  const updatedUsersMap = ref<Record<number, UpdateUserDto>>({})
  const deletedUserIds = ref<Set<number>>(new Set())

  let nextLocalId = 1000
  const service = () => ServiceProvider.get<UserService>('users')

  function applyLocalStateToUser(user: User): User {
    const updates = updatedUsersMap.value[user.id]
    return updates ? { ...user, ...updates } : user
  }

  async function fetchUsers(
    paramsOrLimit: { limit?: number; skip?: number; q?: string } | number = 10,
    skipParam = 0,
    qParam = '',
  ): Promise<void> {
    let limit = 10
    let skip = 0
    let q = ''

    if (typeof paramsOrLimit === 'object') {
      limit = paramsOrLimit.limit ?? 10
      skip = paramsOrLimit.skip ?? 0
      q = paramsOrLimit.q ?? ''
    } else {
      limit = paramsOrLimit
      skip = skipParam
      q = qParam
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await service().getPaginated({ limit, skip, q })

      const apiUsers = response.users
        .filter((u: User) => !deletedUserIds.value.has(u.id))
        .map(applyLocalStateToUser)

      const queryLower = q.trim().toLowerCase()
      const matchingCreated = createdUsers.value
        .filter((u: User) => !deletedUserIds.value.has(u.id))
        .filter((u: User) => {
          if (!queryLower) return true
          const full = `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase()
          return full.includes(queryLower)
        })

      users.value = [...matchingCreated, ...apiUsers]
      total.value = Math.max(
        0,
        response.total + matchingCreated.length - deletedUserIds.value.size,
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
      const localCreated = createdUsers.value.find((u: User) => u.id === id)
      if (localCreated) {
        return applyLocalStateToUser(localCreated)
      }
      const apiUser = await service().getById(id)
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
      const created = await service().create(dto)
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
      const localIndex = createdUsers.value.findIndex((u: User) => u.id === id)
      let updatedResponse: User
      if (localIndex !== -1) {
        const existing = createdUsers.value[localIndex]!
        updatedResponse = { ...existing, ...dto }
        createdUsers.value[localIndex] = updatedResponse
      } else {
        const apiUpdated = await service().update(id, dto)
        updatedResponse = { ...apiUpdated, ...dto, id }
      }

      updatedUsersMap.value[id] = {
        ...updatedUsersMap.value[id],
        ...dto,
      }

      const listIdx = users.value.findIndex((u: User) => u.id === id)
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

  async function removeUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const isLocal = createdUsers.value.some((u: User) => u.id === id)
      if (!isLocal) {
        await service().delete(id)
      }
      deletedUserIds.value.add(id)
      createdUsers.value = createdUsers.value.filter((u: User) => u.id !== id)
      users.value = users.value.filter((u: User) => u.id !== id)
      total.value = Math.max(0, total.value - 1)
    } catch (e) {
      error.value = (e as Error).message || 'Помилка при видаленні користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = removeUser

  return {
    users,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    removeUser,
    deleteUser,
  }
})

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { TOKEN_STORAGE_KEYS } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(
    localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
  )
  const refreshToken = ref<string | null>(
    localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN),
  )

  const getInitialUser = (): AuthUser | null => {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEYS.AUTH_USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  }

  const user = ref<AuthUser | null>(getInitialUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await ServiceProvider.auth.login(credentials)
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken

      const authUser: AuthUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      }
      user.value = authUser

      localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
      localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(TOKEN_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
    } catch (e) {
      error.value = (e as Error).message || 'Помилка авторизації'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!accessToken.value) return
    try {
      const me = await ServiceProvider.auth.getMe()
      user.value = me
      localStorage.setItem(TOKEN_STORAGE_KEYS.AUTH_USER, JSON.stringify(me))
    } catch {
      logout()
    }
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    error.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_STORAGE_KEYS.AUTH_USER)
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchCurrentUser,
    logout,
  }
})

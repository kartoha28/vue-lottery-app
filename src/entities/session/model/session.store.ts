import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthUser, LoginCredentials } from './types'

const STORAGE_PREFIX = 'lottery_session'

export const useSessionStore = defineStore(
  'session',
  () => {
    const accessToken = ref<string | null>(
      localStorage.getItem(`${STORAGE_PREFIX}:token`),
    )
    const refreshToken = ref<string | null>(
      localStorage.getItem(`${STORAGE_PREFIX}:refresh_token`),
    )
    const user = ref<AuthUser | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => accessToken.value !== null)

    const authService = () => ServiceProvider.get<AuthService>('auth')

    function setSession(token: string, newRefreshToken?: string, newUser?: AuthUser): void {
      accessToken.value = token
      localStorage.setItem(`${STORAGE_PREFIX}:token`, token)
      localStorage.setItem('lottery_access_token', token)

      if (newRefreshToken) {
        refreshToken.value = newRefreshToken
        localStorage.setItem(`${STORAGE_PREFIX}:refresh_token`, newRefreshToken)
        localStorage.setItem('lottery_refresh_token', newRefreshToken)
      }

      if (newUser) {
        user.value = newUser
        localStorage.setItem(`${STORAGE_PREFIX}:user`, JSON.stringify(newUser))
        localStorage.setItem('lottery_auth_user', JSON.stringify(newUser))
      }
    }

    function clearSession(): void {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      error.value = null
      localStorage.removeItem(`${STORAGE_PREFIX}:token`)
      localStorage.removeItem(`${STORAGE_PREFIX}:refresh_token`)
      localStorage.removeItem(`${STORAGE_PREFIX}:user`)
      localStorage.removeItem('lottery_access_token')
      localStorage.removeItem('lottery_refresh_token')
      localStorage.removeItem('lottery_auth_user')
    }

    async function login(credentials: LoginCredentials): Promise<void> {
      isLoading.value = true
      error.value = null
      try {
        const response = await authService().login(credentials)
        const authUser: AuthUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        }
        setSession(response.accessToken, response.refreshToken, authUser)
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
        const me = await authService().getMe()
        user.value = me
        localStorage.setItem(`${STORAGE_PREFIX}:user`, JSON.stringify(me))
      } catch {
        clearSession()
      }
    }

    function logout(): void {
      clearSession()
    }

    // Відновлення користувача при завантаженні застосунку
    const storedUser = localStorage.getItem(`${STORAGE_PREFIX}:user`)
    if (storedUser && !user.value) {
      try {
        user.value = JSON.parse(storedUser) as AuthUser
      } catch {
        // ignore JSON parse error
      }
    }

    return {
      accessToken,
      refreshToken,
      user,
      isLoading,
      error,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      fetchCurrentUser,
      logout,
    }
  },
  {
    persist: {
      key: 'lottery_session_persisted',
      pick: ['accessToken', 'refreshToken'],
    },
  },
)

// Аліас для сумісності з попередніми назвами
export const useAuthStore = useSessionStore

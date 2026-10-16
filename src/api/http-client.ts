import type { RefreshTokenResponse } from '@/types/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'lottery_access_token',
  REFRESH_TOKEN: 'lottery_refresh_token',
  AUTH_USER: 'lottery_auth_user',
} as const

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 60,
      }),
    })

    if (!response.ok) {
      localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(TOKEN_STORAGE_KEYS.AUTH_USER)
      return null
    }

    const data = (await response.json()) as RefreshTokenResponse
    localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
    if (data.refreshToken) {
      localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
    }
    return data.accessToken
  } catch {
    return null
  }
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN)

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Interceptor: автоматичне оновлення accessToken через POST /auth/refresh при 401
  if (
    response.status === 401 &&
    retry &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/refresh')
  ) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
    }

    const newAccessToken = await refreshPromise
    if (newAccessToken) {
      headers.set('Authorization', `Bearer ${newAccessToken}`)
      return http<T>(path, { ...options, headers }, false)
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errorBody = (await response.json()) as { message?: string }
      if (errorBody?.message) {
        errorMessage = errorBody.message
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

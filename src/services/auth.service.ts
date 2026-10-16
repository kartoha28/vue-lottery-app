import { http } from '@/api/http-client'
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RefreshTokenResponse,
} from '@/types/auth'

export class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        expiresInMins: 60,
        ...credentials,
      }),
    })
  }

  getMe(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me')
  }

  refresh(refreshToken: string, expiresInMins = 60): Promise<RefreshTokenResponse> {
    return http<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        expiresInMins,
      }),
    })
  }
}

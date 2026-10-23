import { httpClient } from '@/shared/api'
import type {
  AuthResponse,
  AuthUserResponse as AuthUser,
  LoginCredentials,
  RefreshTokenResponse,
} from '../model/types'

export class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        expiresInMins: 60,
        ...credentials,
      }),
    })
  }

  getMe(): Promise<AuthUser> {
    return httpClient<AuthUser>('/auth/me')
  }

  refresh(refreshToken: string, expiresInMins = 60): Promise<RefreshTokenResponse> {
    return httpClient<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        expiresInMins,
      }),
    })
  }
}

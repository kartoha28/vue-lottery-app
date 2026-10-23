import { ServiceProvider } from '@/shared/api'
import { UserService } from '@/entities/user'
import { AuthService } from '@/entities/session'

/**
 * Реєстрація сервісів у ServiceProvider на рівні шару app.
 * Шар app має найвищий пріоритет у FSD, тому зв'язує shared/api з entities/*.
 */
export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}

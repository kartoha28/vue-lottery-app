import { http } from '@/api/http-client'
import type { CreateUserDto, UpdateUserDto, User, UsersResponse } from '@/types/user'
import type { Creatable, Deletable, Editable, Readable } from './interfaces'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<void>
{
  async getPaginated({
    limit = 10,
    skip = 0,
    q = '',
  }: { limit?: number; skip?: number; q?: string } = {}): Promise<UsersResponse> {
    const query = q.trim()
    if (query) {
      return http<UsersResponse>(
        `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
      )
    }
    return http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
  }

  async getAll(params?: { limit?: number; skip?: number; q?: string }): Promise<User[]> {
    const data = await this.getPaginated(params)
    return data.users
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}

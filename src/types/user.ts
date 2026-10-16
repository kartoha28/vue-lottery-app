export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password?: string
  age: number
  gender: 'male' | 'female' | string
  phone: string
  birthDate?: string
  image?: string
}

export type CreateUserDto = Omit<User, 'id'>
export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

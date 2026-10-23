export interface Readable<T> {
  getAll(params?: { limit?: number; skip?: number; q?: string }): Promise<T[]>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate = Omit<T, 'id'>> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate = Partial<Omit<T, 'id'>>> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T = void> {
  delete(id: number): Promise<T>
}

export interface RefreshTokenResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
}

export interface PaginatedResponse<T> {
  users?: T[]
  items?: T[]
  total: number
  skip: number
  limit: number
}

export interface PaginationParams {
  limit?: number
  skip?: number
  q?: string
}

export interface Participant {
  id: string
  name: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export interface Winner {
  id: string
  name: string
  email: string
}

export type SortField = 'name' | 'dateOfBirth'
export type SortDirection = 'asc' | 'desc'

export interface User {
  id: number
  username: string
  email: string
  name: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  company_id: number | null
  company_name: string | null
  created_at: string
  updated_at: string
}

export interface UserResponse {
  details: string
  data: {
    list_items: User[]
    total_items: number
    page: number
    total_pages: number
  }
}

export interface GetUsersParams {
  page: number
  company_id?: number
}

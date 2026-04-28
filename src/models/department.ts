export interface Department {
  id: number
  name: string
  company_id: number
  company_name: string
  created_at: string
  updated_at: string
}

export interface DepartmentResponse {
  details: string
  data: {
    list_items: Department[]
    total_items: number
    page: number
    total_pages: number
  }
}

export interface DepartmentDetailResponse {
  details: string
  data: Department
}
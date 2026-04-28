export interface Employee {
  id: number
  name: string
  email: string
  title: string
  department_id: number
  department_name: string
  company_id: number
  company_name: string
  hire_date: string
  mobile: string
  address: string
  days_employed: number
  is_active: boolean
}

export interface EmployeeResponse {
  details: string
  data: {
    list_items: Employee[]
    total_items: number
    page: number
    total_pages: number
  }
}

export interface EmployeeDetailResponse {
  details: string
  data: Employee
}
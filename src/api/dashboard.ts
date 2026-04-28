import axiosInstance from './base'

export interface DashboardStats {
  total_companies: number
  total_departments: number
  total_employees: number
  active_employees: number
  inactive_employees: number
  avg_days_employed: number
}

export interface DashboardResponse {
  details: string
  data: DashboardStats
}

export const getDashboardStatsAPI = async (
  company_id?: number,
): Promise<DashboardResponse> => {
  const params: Record<string, number> = {}
  if (company_id) params.company_id = company_id
  const response = await axiosInstance.get('companies/dashboard', { params })
  return response.data
}

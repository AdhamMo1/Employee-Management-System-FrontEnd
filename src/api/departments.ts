import axiosInstance from './base'
import type {
  DepartmentResponse,
  DepartmentDetailResponse,
} from '../models/department'

export const getDepartmentsAPI = async (
  company_id?: number,
  page = 1,
): Promise<DepartmentResponse> => {
  const params: Record<string, number> = { page }
  if (company_id) params.company_id = company_id
  const response = await axiosInstance.get('departments', { params })
  return response.data
}

export const createDepartmentAPI = async (
  name: string,
  company_id: number,
): Promise<DepartmentDetailResponse> => {
  const response = await axiosInstance.post('departments', {
    request_data: { name, company_id },
  })
  return response.data
}

export const updateDepartmentAPI = async (
  id: number,
  name: string,
  company_id: number,
): Promise<DepartmentDetailResponse> => {
  const response = await axiosInstance.put(`departments/${id}/`, {
    request_data: { name, company_id },
  })
  return response.data
}

export const deleteDepartmentAPI = async (
  id: number,
): Promise<{ details: string }> => {
  const response = await axiosInstance.delete(`departments/${id}/`)
  return response.data
}



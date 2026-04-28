import axiosInstance from './base'
import type {
  EmployeeResponse,
  EmployeeDetailResponse,
} from '../models/employee'

export const getEmployeesAPI = async (
  page = 1,
  company_id?: number,
): Promise<EmployeeResponse> => {
  const params: Record<string, number> = { page }
  if (company_id) params.company_id = company_id
  const response = await axiosInstance.get('employees', { params })
  return response.data
}

export const createEmployeeAPI = async (data: {
  name: string
  email: string
  password: string
  title: string
  company_id: number
  department_id: number
  mobile?: string
  address?: string
}): Promise<EmployeeDetailResponse> => {
  const response = await axiosInstance.post('employees', {
    request_data: data,
  })
  return response.data
}

export const updateEmployeeAPI = async (
  id: number,
  data: {
    name?: string
    email?: string
    title?: string
    department_id?: number
    mobile?: string
    address?: string
  },
): Promise<EmployeeDetailResponse> => {
  const response = await axiosInstance.put(`employees/${id}/`, {
    request_data: data,
  })
  return response.data
}

export const deleteEmployeeAPI = async (
  id: number,
): Promise<{ details: string }> => {
  const response = await axiosInstance.delete(`employees/${id}/`)
  return response.data
}

export const updateEmployeeStatusAPI = async (
  id: number,
  is_active: boolean,
): Promise<EmployeeDetailResponse> => {
  const response = await axiosInstance.patch(`employees/${id}/`, {
    request_data: { is_active },
  })
  return response.data
}

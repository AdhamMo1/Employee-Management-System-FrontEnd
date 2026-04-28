import axiosInstance from './base'
import type { UserResponse, GetUsersParams } from '../models/user'

export const getUsersAPI = async (
  params: GetUsersParams,
): Promise<UserResponse> => {
  const response = await axiosInstance.get('users', { params })
  return response.data
}

export const createUserAPI = async (data: {
  name: string
  email: string
  password: string
  role: string
  company_id?: number
}): Promise<UserResponse> => {
  const response = await axiosInstance.post('users', {
    request_data: data,
  })
  return response.data
}

export const updateUserAPI = async (
  id: number,
  data: {
    name?: string
    email?: string
    role?: string
    company_id?: number
  },
): Promise<UserResponse> => {
  const response = await axiosInstance.put(`users/${id}/`, {
    request_data: data,
  })
  return response.data
}

export const updateUserStatusAPI = async (
  id: number,
  is_active: boolean,
): Promise<UserResponse> => {
  const response = await axiosInstance.patch(`users/${id}/`, {
    request_data: { is_active },
  })
  return response.data
}

export const deleteUserAPI = async (id: number): Promise<UserResponse> => {
  const response = await axiosInstance.delete(`users/${id}/`)
  return response.data
}

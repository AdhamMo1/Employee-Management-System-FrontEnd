import axiosInstance from './base'
import type { CompanyResponse, CompanyDetailResponse } from '../models/company'

export const getCompaniesAPI = async (
  page: number = 1,
): Promise<CompanyResponse> => {
  const response = await axiosInstance.get('companies', {
    params: { page },
  })
  return response.data
}

export const getCompanyAPI = async (
  id: number,
): Promise<CompanyDetailResponse> => {
  const response = await axiosInstance.get(`companies/${id}/`)
  return response.data
}

export const createCompanyAPI = async (
  name: string,
): Promise<CompanyDetailResponse> => {
  const response = await axiosInstance.post('companies', {
    request_data: { name },
  })
  return response.data
}

export const updateCompanyAPI = async (
  id: number,
  name: string,
): Promise<CompanyDetailResponse> => {
  const response = await axiosInstance.put(`companies/${id}/`, {
    request_data: { name },
  })
  return response.data
}

export const updateCompanyStatusAPI = async (
  id: number,
  is_active: boolean,
): Promise<CompanyDetailResponse> => {
  const response = await axiosInstance.patch(`companies/${id}/`, {
    request_data: { is_active },
  })
  return response.data
}

export const deleteCompanyAPI = async (
  id: number,
): Promise<{ details: string }> => {
  const response = await axiosInstance.delete(`companies/${id}/`)
  return response.data
}

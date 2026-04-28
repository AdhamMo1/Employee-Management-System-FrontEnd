import axiosInstance from './base'
import type { LoginRequest, LoginResponse } from '../models/auth'

export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    const response = await axiosInstance.post('/auth/login', formData)
    return response.data
}
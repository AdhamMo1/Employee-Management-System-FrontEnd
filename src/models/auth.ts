export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    data: {
        session: {
        access_token: string
        refresh_token: string
        }
        user_info: {
        id: number
        email: string
        role: string
        }
    }
    details: string
}
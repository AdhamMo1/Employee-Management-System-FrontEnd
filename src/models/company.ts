export interface Company {
    id: number
    name: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CompanyResponse {
    details: string
    data: {
        list_items: Company[]
        total_items: number
        page: number
        total_pages: number
    }
}

export interface CompanyDetailResponse {
    details: string
    data: Company
}
export interface Activity {
  id: number
  moduleId: number
  type: string
  name: string
  description: string
  startDate: string
  endDate: string
}

export interface CreateActivityRequest {
  moduleId: number
  type: string
  name: string
  description: string
  startDate: string
  endDate: string
}

export interface UpdateActivityRequest {
  moduleId?: number
  type?: string
  name?: string
  description?: string
  startDate?: string
  endDate?: string
}

export interface Student {
  id: string
  name: string
  email: string
}

export interface Course {
  id: string | number
  name: string
  description: string
  startDate: string
  endDate: string
  students?: Student[]
}

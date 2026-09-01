export interface Student {
  id: string
  name: string
  email: string
}

export interface Course {
  id: string
  name: string
  students: Student[]
}

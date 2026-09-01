export interface Student {
  id: string
  name: string
  email: string
}

export interface Course {
  id: string
  name: string
  imageUrl: string
  students: Student[]
}

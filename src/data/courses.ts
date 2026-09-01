import type { Course } from '../types'

// Mock data until this is fetched from an API.
export const courses: Course[] = [
  {
    id: 'react-fundamentals',
    name: 'React Fundamentals',
    students: [
      { id: '1', name: 'Alice Andersson', email: 'alice@example.com' },
      { id: '2', name: 'Bertil Berg', email: 'bertil@example.com' },
      { id: '3', name: 'Cecilia Carlsson', email: 'cecilia@example.com' },
    ],
  },
  {
    id: 'typescript-advanced',
    name: 'Advanced TypeScript',
    students: [
      { id: '4', name: 'David Dahl', email: 'david@example.com' },
      { id: '5', name: 'Erik Ek', email: 'erik@example.com' },
    ],
  },
  {
    id: 'fullstack-node',
    name: 'Fullstack med Node.js',
    students: [{ id: '6', name: 'Frida Forsberg', email: 'frida@example.com' }],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

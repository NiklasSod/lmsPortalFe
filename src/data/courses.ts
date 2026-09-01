import type { Course } from '../types'

// Mock data until this is fetched from an API.
export const courses: Course[] = [
  {
    id: 'react-fundamentals',
    name: 'React Fundamentals',
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80',
    students: [
      { id: '1', name: 'Alice Andersson', email: 'alice@example.com' },
      { id: '2', name: 'Bertil Berg', email: 'bertil@example.com' },
      { id: '3', name: 'Cecilia Carlsson', email: 'cecilia@example.com' },
    ],
  },
  {
    id: 'typescript-advanced',
    name: 'Advanced TypeScript',
    imageUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=900&q=80',
    students: [
      { id: '4', name: 'David Dahl', email: 'david@example.com' },
      { id: '5', name: 'Erik Ek', email: 'erik@example.com' },
    ],
  },
  {
    id: 'fullstack-node',
    name: 'Fullstack med Node.js',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    students: [{ id: '6', name: 'Frida Forsberg', email: 'frida@example.com' }],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

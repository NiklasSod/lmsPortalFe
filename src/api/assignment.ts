import { apiFetch } from '../utils/apifetch'
import { parseApiError } from '../utils/apiError'
import type { Assignment } from '../types/assignment'

export async function getCurrentAssignments(): Promise<Assignment[]> {
  const res = await apiFetch('/api/Assignments/current')

  if (!res.ok) {
    throw new Error(
      await parseApiError(
        res,
        `Failed to fetch current assignments: ${res.status} ${res.statusText}`,
      ),
    )
  }
  return res.json()
}

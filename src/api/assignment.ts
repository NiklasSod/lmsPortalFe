import { apiFetch } from '../utils/apifetch'
import { parseApiError, toApiError } from '../utils/apiError'
import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from '../types/assignment'

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

export async function getAssignmentById(id: number): Promise<Assignment> {
  const res = await apiFetch(`/api/Assignments/${id}`)

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch assignment: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getModuleAssignments(
  moduleId: number,
): Promise<Assignment[]> {
  const res = await apiFetch(`/api/modules/${moduleId}/assignments`)

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch module assignments: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function createAssignment(
  request: CreateAssignmentRequest,
): Promise<Assignment> {
  const res = await apiFetch('/api/Assignments', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not create assignment.'))
  }
  return res.json()
}

export async function createModuleAssignment(
  moduleId: number,
  request: Omit<CreateAssignmentRequest, 'moduleId'> | CreateAssignmentRequest,
): Promise<Assignment> {
  const res = await apiFetch(`/api/modules/${moduleId}/assignments`, {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, 'Could not create assignment for module.'),
    )
  }
  return res.json()
}

export async function updateAssignment(
  id: number,
  request: UpdateAssignmentRequest,
): Promise<Assignment> {
  const res = await apiFetch(`/api/Assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not update assignment.'))
  }
  return res.json()
}

export async function deleteAssignment(id: number): Promise<void> {
  const res = await apiFetch(`/api/Assignments/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error(
      await parseApiError(res, `Failed to delete assignment: ${res.status}`),
    )
  }
}

export async function getMyAssignments(): Promise<Assignment[]> {
  const res = await apiFetch('/api/assignments/mine')

  if (!res.ok) {
    throw new Error(
      await parseApiError(
        res,
        `Failed to fetch your assignments: ${res.status} ${res.statusText}`,
      ),
    )
  }
  return res.json()
}

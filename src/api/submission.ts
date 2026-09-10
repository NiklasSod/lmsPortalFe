import { apiFetch } from '../utils/apifetch'
import { parseApiError, toApiError } from '../utils/apiError'
import type {
  Submission,
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
} from '../types/submission'

export async function getMySubmissions(): Promise<Submission[]> {
  const res = await apiFetch('/api/submissions/mine')

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch your submissions: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getAssignmentSubmissions(
  assignmentId: number,
): Promise<Submission[]> {
  const res = await apiFetch(`/api/assignments/${assignmentId}/submissions`)

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch submissions: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getStudentAssignmentSubmissions(
  assignmentId: number,
  studentId: string,
): Promise<Submission[]> {
  const res = await apiFetch(
    `/api/submissions/assignment/${assignmentId}/student/${studentId}`,
  )

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch student submissions: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function getPendingSubmissions(): Promise<Submission[]> {
  const res = await apiFetch('/api/submissions/pending')

  if (!res.ok) {
    throw await toApiError(
      res,
      `Failed to fetch pending submissions: ${res.status} ${res.statusText}`,
    )
  }
  return res.json()
}

export async function createSubmission(
  request: CreateSubmissionRequest,
): Promise<Submission> {
  const res = await apiFetch('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not submit assignment.'))
  }
  return res.json()
}

export async function updateSubmission(
  id: number,
  request: UpdateSubmissionRequest,
): Promise<Submission> {
  const res = await apiFetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Could not update submission.'))
  }
  return res.json()
}

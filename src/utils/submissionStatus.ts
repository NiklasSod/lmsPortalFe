export type SubmissionStatusKind =
  'approved' | 'revision' | 'handedIn' | 'missing'

export function normalizeStatus(
  status: string | null | undefined,
): SubmissionStatusKind {
  const s = (status ?? '').trim().toLowerCase()
  if (s === 'approved') return 'approved'
  if (s === 'revision') return 'revision'
  if (s === 'handedin' || s === 'handed-in' || s === 'unsent') return 'handedIn'
  return 'missing'
}

export function statusLabel(status: string | null | undefined): string {
  switch (normalizeStatus(status)) {
    case 'approved':
      return 'Approved'
    case 'revision':
      return 'Revision'
    case 'handedIn':
      return 'Handed in'
    default:
      return 'Not submitted'
  }
}

export function statusBadgeBg(
  status: string | null | undefined,
): 'success' | 'danger' | 'warning' | 'secondary' {
  switch (normalizeStatus(status)) {
    case 'approved':
      return 'success'
    case 'revision':
      return 'danger'
    case 'handedIn':
      return 'warning'
    default:
      return 'secondary'
  }
}

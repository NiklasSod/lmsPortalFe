import { Badge } from 'react-bootstrap'
import { Envelope } from 'react-bootstrap-icons'

interface ProfileHeaderProps {
  firstName: string
  lastName: string
  email?: string | null
  roleLabel?: string | null
  myProfile: boolean
}

function getInitials(firstName: string, lastName: string): string {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`
  return (initials || '?').toUpperCase()
}

function ProfileHeader({
  firstName,
  lastName,
  email,
  roleLabel,
  myProfile,
}: ProfileHeaderProps) {
  const displayName = `${firstName} ${lastName}`.trim() || null
  const initials = getInitials(firstName, lastName)

  return (
    <header className="profile-hero d-flex flex-column align-items-center text-center gap-4 mb-5">
      <div
        className="bg-primary bg-gradient text-white fw-bold rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 96, height: 96, fontSize: '2rem' }}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div>
        <p
          className="text-body-secondary small text-uppercase fw-semibold mb-1"
          style={{ letterSpacing: '0.08em' }}
        >
          {myProfile ? 'My Profile' : 'Profile'}
        </p>
        <h1 className="h2 fw-bold mb-1">{displayName ?? 'User'}</h1>
        <div className="profile-hero-meta d-flex flex-column align-items-center justify-content-center gap-2">
          {roleLabel && (
            <Badge pill bg="primary">
              {roleLabel}
            </Badge>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-body-secondary text-decoration-none d-inline-flex align-items-center gap-1"
            >
              <Envelope aria-hidden="true" />
              <span className="text-break">{email}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}

export default ProfileHeader

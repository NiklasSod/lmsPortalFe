import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, Badge, Col, Container, Row, Spinner } from 'react-bootstrap'
import {
  Calendar3,
  Envelope,
  Github,
  Person,
  Stars,
  Whatsapp,
} from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import { getUser } from '../../api/user'
import type { UserDto } from '../../api/user'
import { getProfile } from '../../api/userProfile'
import type { ProfileRequest } from '../../types/userProfile'

function getInitials(firstName: string, lastName: string): string {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`
  return (initials || '?').toUpperCase()
}

function formatDate(value?: string): string | null {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function SectionTitle({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <h2 className="h5 fw-semibold d-flex align-items-center gap-2 mb-3">
      <span className="text-body-secondary d-inline-flex" aria-hidden="true">
        {icon}
      </span>
      {children}
    </h2>
  )
}

const ProfileView = () => {
  const [user, setUser] = useState<UserDto>()
  const [userProfile, setUserProfile] = useState<ProfileRequest>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const location = useLocation()
  const currUserId = location.state?.currUserId as string | undefined

  const { userId } = useAuth()
  const myProfile = !currUserId || currUserId === userId

  useEffect(() => {
    const ownerId = currUserId ?? userId
    if (!ownerId) return
    let cancelled = false

    Promise.all([getProfile(ownerId), getUser(ownerId)])
      .then(([profile, userInfo]) => {
        if (cancelled) return
        setUserProfile(profile)
        setUser(userInfo)
        setError(null)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [currUserId, userId])

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || null
    : null
  const initials = user ? getInitials(user.firstName, user.lastName) : '?'
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null
  const aboutMe = userProfile?.aboutMe?.trim()
  const skills = userProfile?.skills?.filter((skill) => skill.trim()) ?? []
  const dateOfBirth = formatDate(userProfile?.dateOfBirth)
  const whatsAppNumber = userProfile?.whatsAppNumber?.trim()
  const gitHubLink = userProfile?.gitHubLink?.trim()

  const hasDetails = Boolean(dateOfBirth || whatsAppNumber || gitHubLink)

  return (
    <Container className="py-4">
      {loading && (
        <div className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading profile…</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && user && (
        <>
          {/* Header */}
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
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="text-body-secondary text-decoration-none d-inline-flex align-items-center gap-1"
                  >
                    <Envelope aria-hidden="true" />
                    <span className="text-break">{user.email}</span>
                  </a>
                )}
              </div>
            </div>
          </header>

          <Row className="g-5">
            <Col lg={7}>
              {/* About */}
              <section className="mb-5">
                <SectionTitle icon={<Person aria-hidden="true" />}>
                  About
                </SectionTitle>
                {aboutMe ? (
                  <p className="mb-0">{aboutMe}</p>
                ) : (
                  <p className="text-body-secondary fst-italic mb-0">
                    Nothing here yet.
                  </p>
                )}
              </section>

              {/* Skills */}
              <section>
                <SectionTitle icon={<Stars aria-hidden="true" />}>
                  Skills
                </SectionTitle>
                {skills.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge rounded-pill text-bg-secondary px-3 py-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-secondary fst-italic mb-0">
                    No skills listed yet.
                  </p>
                )}
              </section>
            </Col>

            <Col lg={5}>
              {/* Details */}
              <h2 className="h5 fw-semibold mb-3">Details</h2>
              {hasDetails ? (
                <div>
                  {dateOfBirth && (
                    <div className="d-flex align-items-center gap-3 py-3 border-bottom">
                      <span
                        className="text-body-secondary d-inline-flex"
                        aria-hidden="true"
                      >
                        <Calendar3 />
                      </span>
                      <div className="text-break">
                        <div
                          className="small text-body-secondary text-uppercase fw-semibold"
                          style={{ letterSpacing: '0.04em' }}
                        >
                          Date of birth
                        </div>
                        {dateOfBirth}
                      </div>
                    </div>
                  )}
                  {whatsAppNumber && (
                    <div className="d-flex align-items-center gap-3 py-3 border-bottom">
                      <span
                        className="text-body-secondary d-inline-flex"
                        aria-hidden="true"
                      >
                        <Whatsapp />
                      </span>
                      <div className="text-break">
                        <div
                          className="small text-body-secondary text-uppercase fw-semibold"
                          style={{ letterSpacing: '0.04em' }}
                        >
                          WhatsApp
                        </div>
                        {whatsAppNumber}
                      </div>
                    </div>
                  )}
                  {gitHubLink && (
                    <div className="d-flex align-items-center gap-3 py-3 border-bottom">
                      <span
                        className="text-body-secondary d-inline-flex"
                        aria-hidden="true"
                      >
                        <Github />
                      </span>
                      <div className="text-break">
                        <div
                          className="small text-body-secondary text-uppercase fw-semibold"
                          style={{ letterSpacing: '0.04em' }}
                        >
                          GitHub
                        </div>
                        <a
                          href={gitHubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none"
                        >
                          {gitHubLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-body-secondary fst-italic mb-0">
                  No additional details added yet.
                </p>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default ProfileView

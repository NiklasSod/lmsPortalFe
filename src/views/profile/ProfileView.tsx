import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import { getUser } from '../../api/user'
import type { UserDto } from '../../api/user'
import { getProfile } from '../../api/userProfile'
import type { ProfileRequest } from '../../types/userProfile'
import ProfileHeader from '../../components/profile/ProfileHeader'
import ProfileAbout from '../../components/profile/ProfileAbout'
import ProfileSkills from '../../components/profile/ProfileSkills'
import ProfileDetails from '../../components/profile/ProfileDetails'

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

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null
  const aboutMe = userProfile?.aboutMe?.trim()
  const skills = userProfile?.skills?.filter((skill) => skill.trim()) ?? []
  const whatsAppNumber = userProfile?.whatsAppNumber?.trim()
  const gitHubLink = userProfile?.gitHubLink?.trim()

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
          <ProfileHeader
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            roleLabel={roleLabel}
            myProfile={myProfile}
          />

          <Row className="g-5">
            <Col lg={7}>
              <div className="mb-5">
                <ProfileAbout aboutMe={aboutMe} />
              </div>
              <ProfileSkills skills={skills} />
            </Col>

            <Col lg={5}>
              <ProfileDetails
                dateOfBirth={userProfile?.dateOfBirth}
                whatsAppNumber={whatsAppNumber}
                gitHubLink={gitHubLink}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default ProfileView

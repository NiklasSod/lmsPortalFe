import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../auth/AuthContext'
import { getUser } from '../../api/user'
import type { UserDto } from '../../api/user'
import { getProfile } from '../../api/userProfile'
import type { ProfileRequest } from '../../types/userProfile'

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

  return (
    <Container className="py-4">
      <Row className="g-4 align-items-start">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header as="h2" className="h5 mb-0">
              {myProfile ? 'My Profile' : `${displayName ?? 'User'} Profile`}
            </Card.Header>
            <Card.Body>
              {loading && <Spinner animation="border" size="sm" />}
              {error && <Alert variant="danger">{error}</Alert>}
              {!loading && !error && userProfile?.aboutMe && (
                <p className="mb-0">{userProfile.aboutMe}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileView

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Col,
  Collapse,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { ChevronDown } from 'react-bootstrap-icons'
import { useAuth } from '../../auth/AuthContext'
import { useEditMode } from '../../editMode/EditModeContext'
import { deleteAccount, getUser } from '../../api/user'
import type { UserDto } from '../../api/user'
import { getProfile } from '../../api/userProfile'
import type { ProfileRequest } from '../../types/userProfile'
import { ApiError } from '../../utils/apiError'
import ProfileHeader from '../../components/profile/ProfileHeader'
import ProfileAbout from '../../components/profile/ProfileAbout'
import ProfileSkills from '../../components/profile/ProfileSkills'
import ProfileDetails from '../../components/profile/ProfileDetails'
import ConfirmModal from '../../components/ConfirmModal'
import EditAccountForm from '../../components/profile/EditAccountForm'
import ChangePasswordForm from '../../components/profile/ChangePasswordForm'
import CreateProfileForm from '../../components/profile/CreateProfileForm'

const ProfileView = () => {
  const [user, setUser] = useState<UserDto>()
  const [userProfile, setUserProfile] = useState<ProfileRequest>()
  const [profileMissing, setProfileMissing] = useState(false)
  const [loadedOwnerId, setLoadedOwnerId] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showEditSection, setShowEditSection] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showDeleteSection, setShowDeleteSection] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const currUserId = location.state?.currUserId as string | undefined

  const { userId, role, logout } = useAuth()
  const { editMode, setEditMode } = useEditMode()
  const isTeacher = role !== 'student'
  const myProfile = !currUserId || currUserId === userId
  const canDeleteSelf = myProfile && role?.toLowerCase() !== 'admin'

  const ownerId = currUserId ?? userId
  const loading = !ownerId || loadedOwnerId !== ownerId

  useEffect(() => {
    if (!ownerId) return
    let cancelled = false

    Promise.allSettled([getUser(ownerId), getProfile(ownerId)]).then(
      ([userResult, profileResult]) => {
        if (cancelled) return

        setError(null)

        if (userResult.status === 'fulfilled') {
          setUser(userResult.value)
        } else {
          const err = userResult.reason
          setError(
            err instanceof Error ? err.message : 'Could not load your account.',
          )
        }

        if (profileResult.status === 'fulfilled') {
          setUserProfile(profileResult.value)
          setProfileMissing(false)
        } else {
          const err = profileResult.reason
          if (err instanceof ApiError && err.status === 404) {
            setProfileMissing(true)
          } else {
            setError(
              err instanceof Error ? err.message : 'Could not load profile.',
            )
          }
        }

        setLoadedOwnerId(ownerId)
      },
    )

    return () => {
      cancelled = true
    }
  }, [ownerId])

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null
  const aboutMe = userProfile?.aboutMe?.trim()
  const skills = userProfile?.skills?.filter((skill) => skill.trim()) ?? []
  const whatsAppNumber = userProfile?.whatsAppNumber?.trim()
  const gitHubLink = userProfile?.gitHubLink?.trim()

  const handleProfileCreated = (profile: ProfileRequest) => {
    setUserProfile(profile)
    setProfileMissing(false)
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteAccount()
      await logout()
      navigate('/login', { replace: true })
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : 'Could not delete your account.',
      )
      setIsDeleting(false)
    }
  }

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

          {profileMissing && myProfile ? (
            <CreateProfileForm onCreated={handleProfileCreated} />
          ) : profileMissing ? (
            <Alert variant="info">
              This user hasn&apos;t set up their profile yet.
            </Alert>
          ) : (
            <Row className="g-5">
              <Col lg={7}>
                <div className="mb-5">
                  <ProfileAbout aboutMe={aboutMe} />

                  {isTeacher && myProfile && (
                    <Form.Check
                      type="switch"
                      id="edit-mode-switch"
                      label="Edit mode"
                      checked={editMode}
                      onChange={(e) => setEditMode(e.target.checked)}
                      className="my-3"
                    />
                  )}
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
          )}

          {canDeleteSelf && (
            <>
              <hr className="my-4" style={{ maxWidth: '400px' }} />
              <section
                className="d-flex flex-column"
                style={{ maxWidth: '400px' }}
              >
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowEditSection((open) => !open)}
                    aria-expanded={showEditSection}
                    aria-controls="edit-account-collapse"
                    className="d-flex align-items-center justify-content-between w-100 p-0 border-0 text-decoration-none pb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="h5 fw-semibold mb-0">Edit profile</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={20}
                      className="text-body-secondary"
                      style={{
                        transform: showEditSection
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </Button>
                  <Collapse in={showEditSection}>
                    <div id="edit-account-collapse" className="pt-3 pb-4">
                      <p className="text-body-secondary mb-3">
                        Update your first name, last name and / or email
                        address.
                      </p>
                      <EditAccountForm
                        key={user.id}
                        user={user}
                        onUpdated={setUser}
                      />
                    </div>
                  </Collapse>
                </div>

                <div className="border-top pt-4" style={{ maxWidth: '400px' }}>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowPasswordSection((open) => !open)}
                    aria-expanded={showPasswordSection}
                    aria-controls="change-password-collapse"
                    className="d-flex align-items-center justify-content-between w-100 p-0 border-0 text-decoration-none pb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="h5 fw-semibold mb-0">Change password</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={20}
                      className="text-body-secondary"
                      style={{
                        transform: showPasswordSection
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </Button>
                  <Collapse in={showPasswordSection}>
                    <div id="change-password-collapse" className="pt-3 pb-4">
                      <p className="text-body-secondary mb-3">
                        Set a new password for your account.
                      </p>
                      <ChangePasswordForm />
                    </div>
                  </Collapse>
                </div>

                <div className="border-top pt-4" style={{ maxWidth: '400px' }}>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowDeleteSection((open) => !open)}
                    aria-expanded={showDeleteSection}
                    aria-controls="delete-account-collapse"
                    className="d-flex align-items-center justify-content-between w-100 p-0 border-0 text-decoration-none"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="h5 fw-semibold mb-0 text-danger">
                      Delete profile
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      size={20}
                      className="text-danger"
                      style={{
                        transform: showDeleteSection
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </Button>
                  <Collapse in={showDeleteSection}>
                    <div id="delete-account-collapse" className="pt-3">
                      <p className="text-body-secondary mb-3">
                        Permanently delete your account, your profile and all of
                        your data.
                        <br /> This action cannot be undone.
                      </p>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ maxWidth: '150px' }}
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete account
                      </Button>
                    </div>
                  </Collapse>
                </div>
              </section>
            </>
          )}
        </>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete account"
        confirmLabel="Delete account"
        busyLabel="Deleting..."
        variant="danger"
        isBusy={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        message={
          <>
            Are you sure you want to permanently delete your account? This will
            remove your profile and all of your data. This action cannot be
            undone.
          </>
        }
      />
    </Container>
  )
}

export default ProfileView

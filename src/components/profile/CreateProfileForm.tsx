import { useState } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import { createProfile } from '../../api/userProfile'
import type { ProfileRequest } from '../../types/userProfile'

interface CreateProfileFormProps {
  onCreated: (profile: ProfileRequest) => void
}

const inputStyle = {
  borderRadius: '6px',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--input-text)',
  borderColor: 'var(--input-border)',
}

function normalizeUrl(raw: string): string {
  const value = raw.trim()
  if (!value) return value
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function CreateProfileForm({ onCreated }: CreateProfileFormProps) {
  const [aboutMe, setAboutMe] = useState('')
  const [gitHubLink, setGitHubLink] = useState('')
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const addSkill = () => {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) {
      setSkills((prev) => [...prev, value])
    }
    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const created = await createProfile({
        aboutMe: aboutMe.trim() || undefined,
        gitHubLink: gitHubLink.trim() ? normalizeUrl(gitHubLink) : undefined,
        skills,
        whatsAppNumber: whatsAppNumber.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
      })
      onCreated(created)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Could not save your profile.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="py-4 ">
      <div className="mb-4">
        <h2 className="h4 fw-semibold mb-2">Set up your profile</h2>
        <p className="text-body-secondary mb-0">
          You don&apos;t have a profile yet. Add a little about yourself so
          others can get to know you.
        </p>
      </div>
      <Col lg={8}>
        <Form onSubmit={handleSubmit} noValidate>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="profileAbout">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              About me
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Tell others a bit about yourself"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={inputStyle}
            />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group
                className="fw-normal mb-1 small"
                controlId="profileDob"
              >
                <Form.Label
                  className="fw-normal mb-1 small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Date of birth
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="py-2 px-3 shadow-none"
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="profileWhatsapp">
                <Form.Label
                  className="fw-normal mb-1 small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  WhatsApp number
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="e.g. +46 70 123 45 67"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className="py-2 px-3 shadow-none"
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="profileGithub">
            <Form.Label
              className="mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              GitHub link
            </Form.Label>
            <Form.Control
              type="url"
              placeholder="https://github.com/username"
              value={gitHubLink}
              onChange={(e) => setGitHubLink(e.target.value)}
              className="py-2 px-3 shadow-none"
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="profileSkills">
            <Form.Label
              className="fw-normal mb-1 small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Skills
            </Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="e.g. JavaScript. Write one --> Click Add. Repeat."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                className="py-2 px-3 shadow-none"
                style={inputStyle}
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge rounded-pill text-bg-secondary px-3 py-2 d-inline-flex align-items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      className="btn btn-sm p-0 text-white d-inline-flex align-items-center"
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="dark"
            disabled={isSaving}
            style={{
              backgroundColor: 'var(--btn-bg)',
              borderColor: 'var(--btn-bg)',
              color: 'var(--btn-text)',
              borderRadius: '6px',
            }}
          >
            {isSaving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Create profile'
            )}
          </Button>
        </Form>
      </Col>
    </section>
  )
}

export default CreateProfileForm

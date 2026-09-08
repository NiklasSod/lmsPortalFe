import type { ReactNode } from 'react'
import { Calendar3, Github, Whatsapp } from 'react-bootstrap-icons'

interface ProfileDetailsProps {
  dateOfBirth?: string
  whatsAppNumber?: string
  gitHubLink?: string
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

interface DetailRowProps {
  icon: ReactNode
  label: string
  children: ReactNode
}

function DetailRow({ icon, label, children }: DetailRowProps) {
  return (
    <div className="d-flex align-items-center gap-3 py-3">
      <span className="text-body-secondary d-inline-flex" aria-hidden="true">
        {icon}
      </span>
      <div className="text-break">
        <div
          className="small text-body-secondary text-uppercase fw-semibold"
          style={{ letterSpacing: '0.04em' }}
        >
          {label}
        </div>
        {children}
      </div>
    </div>
  )
}

function ProfileDetails({
  dateOfBirth,
  whatsAppNumber,
  gitHubLink,
}: ProfileDetailsProps) {
  const dob = formatDate(dateOfBirth)
  const hasDetails = Boolean(dob || whatsAppNumber || gitHubLink)

  return (
    <>
      <h2 className="h5 fw-semibold mb-3">Details</h2>
      {hasDetails ? (
        <div>
          {dob && (
            <DetailRow icon={<Calendar3 />} label="Date of birth">
              {dob}
            </DetailRow>
          )}
          {whatsAppNumber && (
            <DetailRow icon={<Whatsapp />} label="WhatsApp">
              {whatsAppNumber}
            </DetailRow>
          )}
          {gitHubLink && (
            <DetailRow icon={<Github />} label="GitHub">
              <a
                href={gitHubLink}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                {gitHubLink}
              </a>
            </DetailRow>
          )}
        </div>
      ) : (
        <p className="text-body-secondary fst-italic mb-0">
          No additional details added yet.
        </p>
      )}
    </>
  )
}

export default ProfileDetails

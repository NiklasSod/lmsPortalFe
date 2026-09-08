import { Person } from 'react-bootstrap-icons'
import SectionTitle from './SectionTitle'

interface ProfileAboutProps {
  aboutMe?: string
}

function ProfileAbout({ aboutMe }: ProfileAboutProps) {
  return (
    <section>
      <SectionTitle icon={<Person aria-hidden="true" />}>About</SectionTitle>
      {aboutMe ? (
        <p className="mb-0">{aboutMe}</p>
      ) : (
        <p className="text-body-secondary fst-italic mb-0">Nothing here yet.</p>
      )}
    </section>
  )
}

export default ProfileAbout

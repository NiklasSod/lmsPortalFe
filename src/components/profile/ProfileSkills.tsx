import { Stars } from 'react-bootstrap-icons'
import SectionTitle from './SectionTitle'

interface ProfileSkillsProps {
  skills: string[]
}

function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <section>
      <SectionTitle icon={<Stars aria-hidden="true" />}>Skills</SectionTitle>
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
  )
}

export default ProfileSkills

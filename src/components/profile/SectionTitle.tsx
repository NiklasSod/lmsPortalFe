import type { ReactNode } from 'react'

interface SectionTitleProps {
  icon: ReactNode
  children: ReactNode
}

function SectionTitle({ icon, children }: SectionTitleProps) {
  return (
    <h2 className="h5 fw-semibold d-flex align-items-center gap-2 mb-3">
      <span className="text-body-secondary d-inline-flex" aria-hidden="true">
        {icon}
      </span>
      {children}
    </h2>
  )
}

export default SectionTitle

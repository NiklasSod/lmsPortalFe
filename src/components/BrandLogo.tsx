import { Book } from 'react-bootstrap-icons'

interface BrandLogoProps {
  size?: number
  iconSize?: number
  className?: string
}

export const BrandLogo = ({
  size = 32,
  iconSize = 18,
  className = '',
}: BrandLogoProps) => {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <span
        className="d-flex align-items-center justify-content-center bg-danger rounded"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <Book color="white" size={iconSize} />
      </span>
      <span
        className="fw-bold fs-5"
        style={{ letterSpacing: '0.5px', color: 'var(--text-primary)' }}
      >
        Lumen LMS
      </span>
    </div>
  )
}

export default BrandLogo
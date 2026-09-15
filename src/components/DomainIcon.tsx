import type { JSX } from 'react'
import {
  MortarboardFill,
  JournalBookmark,
  ListCheck,
  JournalCheck,
  Bell,
} from 'react-bootstrap-icons'

interface DomainIconProps {
  type?: string
  size?: number
  className?: string
}

export const DomainIcon = ({
  type,
  size = 20,
  className = 'flex-shrink-0',
}: DomainIconProps): JSX.Element => {
  if (!type) return <JournalCheck size={size} className={className} />

  const normalized = type.toLowerCase()

  if (normalized.includes('course')) return <MortarboardFill size={size} className={className} />
  if (normalized.includes('module')) return <JournalBookmark size={size} className={className} />
  if (normalized.includes('activ')) return <ListCheck size={size} className={className} />
  if (
    normalized.includes('assign') ||
    normalized.includes('submission') ||
    normalized.includes('feedback')
  ) {
    return <JournalCheck size={size} className={className} />
  }

  return <Bell size={size} className={className} />
}

export default DomainIcon
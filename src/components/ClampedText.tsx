import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

interface ClampedTextProps {
  text: string
  lines?: number
  className?: string
}

const ClampedText = ({ text, lines = 3, className }: ClampedTextProps) => {
  const textRef = useRef<HTMLParagraphElement | null>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const el = textRef.current
    if (!el || expanded) return

    const measure = () => {
      setHasOverflow(el.scrollHeight > el.clientHeight)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [text, expanded])

  const clampStyle = expanded
    ? undefined
    : ({
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      } as CSSProperties)

  return (
    <>
      <p ref={textRef} className={className} style={clampStyle}>
        {text}
      </p>
      {hasOverflow && (
        <button
          type="button"
          className="btn btn-link btn-sm p-0 text-decoration-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </>
  )
}

export default ClampedText

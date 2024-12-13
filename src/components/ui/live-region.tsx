import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  'aria-live'?: 'polite' | 'assertive'
}

export function LiveRegion({ 
  message, 
  'aria-live': ariaLive = 'polite' 
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Force screen readers to announce changes
    const region = regionRef.current
    if (region) {
      region.textContent = ''
      setTimeout(() => {
        region.textContent = message
      }, 100)
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      className="sr-only"
      role="status"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      {message}
    </div>
  )
} 
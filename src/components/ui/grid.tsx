import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
}

export function Grid({ 
  children, 
  cols = { default: 1 },
  gap = "gap-6",
  className,
  ...props 
}: GridProps) {
  if (cols.default < 1 || cols.default > 12) {
    console.warn('Grid columns should be between 1 and 12')
  }

  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    // ... etc
  }

  return (
    <div
      className={cn(
        "grid",
        gap,
        gridColsMap[cols.default],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
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

const gridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12'
} as const

const smGridColsMap = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6'
} as const

const mdGridColsMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6'
} as const

const lgGridColsMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6'
} as const

const xlGridColsMap = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6'
} as const

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

  return (
    <div
      className={cn(
        "grid",
        gap,
        gridColsMap[cols.default as keyof typeof gridColsMap],
        cols.sm && smGridColsMap[cols.sm as keyof typeof smGridColsMap],
        cols.md && mdGridColsMap[cols.md as keyof typeof mdGridColsMap],
        cols.lg && lgGridColsMap[cols.lg as keyof typeof lgGridColsMap],
        cols.xl && xlGridColsMap[cols.xl as keyof typeof xlGridColsMap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
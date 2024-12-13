import { cn } from "@/lib/utils"

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-50",
        "bg-white p-4 rounded-md shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500"
      )}
    >
      Skip to main content
    </a>
  )
} 
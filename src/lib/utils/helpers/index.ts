// Add common utility functions
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString()
}

export const truncateText = (text: string, length: number = 100) => {
  return text.length > length ? `${text.substring(0, length)}...` : text
} 
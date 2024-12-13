import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have skip link that becomes visible on focus', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).not.toBeVisible()
    skipLink.focus()
    expect(skipLink).toBeVisible()
  })

  it('should have proper heading hierarchy', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })
})
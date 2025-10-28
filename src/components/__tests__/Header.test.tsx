import { render, screen, fireEvent } from '../../utils/test-utils'

import Header from '../Header'

describe('Header component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app title', () => {
    render(<Header />)
    expect(screen.getByText((_, element) => {
      return element?.textContent === 'TaskTracker'
    })).toBeInTheDocument()
  })

  it('toggles theme on click', () => {
    render(<Header />)

    const before = document.documentElement.getAttribute('data-theme')
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    const after = document.documentElement.getAttribute('data-theme')

    expect(before).toBe('light')
    expect(after).toBe('dark')
  })

  it('renders two action buttons', () => {
    render(<Header />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
  })
})



import { render, screen, fireEvent } from '../../utils/test-utils'

import Header from '../Header'

describe('Header component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app title', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('p')?.textContent).toBe('TaskTracker')
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



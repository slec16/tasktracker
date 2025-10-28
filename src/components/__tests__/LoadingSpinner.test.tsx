import { render } from '../../utils/test-utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner component', () => {
  it('renders with default md size', () => {
    const { container } = render(<LoadingSpinner />)
    const wrapper = container.querySelector('.inline-block')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('w-12')
    expect(wrapper).toHaveClass('h-12')
  })

  it('contains spinning element', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})



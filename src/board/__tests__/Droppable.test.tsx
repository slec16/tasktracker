import { render } from '../../utils/test-utils'
import { Droppable } from '../Droppable'

jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(() => ({ isOver: false, setNodeRef: jest.fn() })),
}))

describe('Droppable component', () => {
  it('renders children', () => {
    const { container } = render(
      <Droppable id="test">
        <div data-testid="child">Child</div>
      </Droppable>
    )

    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument()
  })

})



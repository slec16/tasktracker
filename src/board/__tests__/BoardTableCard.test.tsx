import { render, screen, fireEvent } from '../../utils/test-utils'
import BoardTableCard from '../BoardTableCard'
import { openDrawer, type DrawerState } from '../../store/drawerSlice'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { type BoardTasks } from '../../api/boardApi'

jest.mock('../../hooks/redux')
jest.mock('../../store/drawerSlice', () => {
  const actual = jest.requireActual('../../store/drawerSlice')
  return {
    ...actual,
    openDrawer: jest.fn((payload) => ({ type: 'drawer/openDrawer', payload })),
  }
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}))

jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: jest.fn(), transform: null }),
  useDndContext: () => ({ active: null }),
}))

const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>

describe('BoardTableCard component', () => {
  const baseTask: BoardTasks = {
    id: 42,
    title: 'Sample Task',
    description: 'desc',
    priority: 'High',
    status: 'Backlog',
    assignee: { id: 7, fullName: 'John Doe', email: 'john@example.com', avatarUrl: '' },
  }

  const dispatchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAppDispatch.mockReturnValue(dispatchMock)
    mockUseAppSelector.mockReturnValue({
      isOpen: false,
      drawerId: null,
      boardId: null,
      refetchState: false,
    } as DrawerState)
  })

  it('renders task title', () => {
    render(<BoardTableCard task={baseTask} />)
    expect(screen.getByText('Sample Task')).toBeInTheDocument()
  })

  it('renders correct priority style', () => {
    const mediumTask: BoardTasks = { ...baseTask, priority: 'Medium' }
    const lowTask: BoardTasks = { ...baseTask, priority: 'Low' }
    const { container } = render(<BoardTableCard task={baseTask} />)
    const { container: c1 } = render(<BoardTableCard task={mediumTask} />)
    const { container: c2 } = render(<BoardTableCard task={lowTask} />)
    expect(container.querySelector('.bg-red-100')).toBeInTheDocument()
    expect(c1.querySelector('.bg-yellow-100')).toBeInTheDocument()
    expect(c2.querySelector('.bg-gray-100')).toBeInTheDocument()
  })

  it('dispatches openDrawer on click with correct payload', () => {
    render(<BoardTableCard task={baseTask} />)
    const card = screen.getByText('Sample Task').closest('div')!
    fireEvent.click(card)

    expect(dispatchMock).toHaveBeenCalledWith(
      openDrawer({ drawerId: '42', boardId: '1' })
    )
  })

  it('shows assignee initials', () => {
    const task: BoardTasks = { ...baseTask, assignee: { ...baseTask.assignee, fullName: 'John Doe' } }
    render(<BoardTableCard task={task} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('sets aria-selected when drawerId matches task id', () => {
    type DrawerState = {
      isOpen: boolean
      drawerId: string | null
      boardId: string | null
      refetchState?: boolean
    }
    mockUseAppSelector.mockReturnValue({
      isOpen: true,
      drawerId: '42',
      boardId: '1',
      refetchState: false,
    } as DrawerState)

    const { container } = render(<BoardTableCard task={baseTask} />)
    expect(container.querySelector('[aria-selected="true"]')).toBeInTheDocument()
  })
})



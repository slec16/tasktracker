import { render, screen, fireEvent } from '../test-utils'
import IssuesItem from '../IssuesItem'
import { type Task } from '../../api/taskApi'
import { openDrawer } from '../../store/drawerSlice'
import { useAppSelector } from '../../hooks/redux'
import { useAppDispatch } from '../../hooks/redux'

jest.mock('../../hooks/redux')
jest.mock('../../store/drawerSlice', () => ({
  openDrawer: jest.fn((payload) => ({
    type: 'drawer/openDrawer',
    payload,
  })),
}))

const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>

describe('IssuesItem Component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'High',
    status: 'Backlog',
    boardId: 1,
    boardName: 'Test Board',
    assignee: {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      avatarUrl: '',
    },
  }

  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAppDispatch.mockReturnValue(mockDispatch)
    mockUseAppSelector.mockReturnValue({
      isOpen: false,
      drawerId: null,
      boardId: null,
      refetchState: false,
    })
  })

  it('should render task data correctly', () => {
    render(<IssuesItem taskData={mockTask} />)

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Board')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render correct priority icon for High priority', () => {
    const { container } = render(<IssuesItem taskData={mockTask} />)

    const priorityElement = container.querySelector('.bg-red-100')
    expect(priorityElement).toBeInTheDocument()
  })

  it('should render correct priority icon for Medium priority', () => {
    const mediumTask = { ...mockTask, priority: 'Medium' }
    const { container } = render(<IssuesItem taskData={mediumTask} />)

    const priorityElement = container.querySelector('.bg-yellow-100')
    expect(priorityElement).toBeInTheDocument()
  })

  it('should render correct priority icon for Low priority', () => {
    const lowTask = { ...mockTask, priority: 'Low' }
    const { container } = render(<IssuesItem taskData={lowTask} />)

    const priorityElement = container.querySelector('.bg-gray-100')
    expect(priorityElement).toBeInTheDocument()
  })

  it('should call openDrawer when clicked', () => {
    render(<IssuesItem taskData={mockTask} />)

    const item = screen.getByText('Test Task').closest('div')
    fireEvent.click(item!)

    expect(mockDispatch).toHaveBeenCalledWith(
      openDrawer({
        drawerId: '1',
        boardId: '1',
      })
    )
  })

  it('should show aria-selected when drawer is open for this task', () => {
    mockUseAppSelector.mockReturnValue({
      isOpen: true,
      drawerId: '1',
      boardId: '1',
      refetchState: false,
    })

    const { container } = render(<IssuesItem taskData={mockTask} />)

    const item = container.querySelector('[aria-selected="true"]')
    expect(item).toBeInTheDocument()
  })

  it('should not show aria-selected when drawer is open for a different task', () => {
    mockUseAppSelector.mockReturnValue({
      isOpen: true,
      drawerId: '2',
      boardId: '1',
      refetchState: false,
    })

    const { container } = render(<IssuesItem taskData={mockTask} />)

    const item = container.querySelector('[aria-selected="true"]')
    expect(item).not.toBeInTheDocument()
    
    const notSelectedItem = container.querySelector('[aria-selected="false"]')
    expect(notSelectedItem).toBeInTheDocument()
  })

  it('should render StatusTimeline correctly for Backlog status', () => {
    render(<IssuesItem taskData={mockTask} />)

    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })

  it('should render StatusTimeline correctly for InProgress status', () => {
    const inProgressTask = { ...mockTask, status: 'InProgress' }
    render(<IssuesItem taskData={inProgressTask} />)

    expect(screen.getByText('InProgress')).toBeInTheDocument()
  })

  it('should render StatusTimeline correctly for Done status', () => {
    const doneTask = { ...mockTask, status: 'Done' }
    render(<IssuesItem taskData={doneTask} />)

    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('should render assignee initials correctly', () => {
    const taskWithMultipleNames = { ...mockTask, assignee: { ...mockTask.assignee, fullName: 'John Michael Doe' } }
    render(<IssuesItem taskData={taskWithMultipleNames} />)

    const avatar = screen.getByText('JMD')
    expect(avatar).toBeInTheDocument()
  })
})


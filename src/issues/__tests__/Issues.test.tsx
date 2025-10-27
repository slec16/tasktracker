import { render, screen } from '../test-utils'
import Issues from '../Issues'
import { useTasks } from '../../hooks/useTasks'

jest.mock('../../hooks/useTasks')

const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>

describe('Issues Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Description 1',
      priority: 'High',
      status: 'Backlog',
      boardId: 1,
      boardName: 'Board 1',
      assignee: {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '',
      },
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Description 2',
      priority: 'Medium',
      status: 'InProgress',
      boardId: 1,
      boardName: 'Board 1',
      assignee: {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '',
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading spinner when isLoading is true', () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useTasks>)

    const { container } = render(<Issues />)
    
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should render error message when isError is true', () => {
    const errorMessage = 'Failed to fetch tasks'
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: errorMessage, name: 'Error' } as Error,
    } as ReturnType<typeof useTasks>)

    render(<Issues />)
    
    expect(screen.getByText(`Ошибка: ${errorMessage}`)).toBeInTheDocument()
  })

  it('should render IssuesList when data is loaded', () => {
    mockUseTasks.mockReturnValue({
      data: { data: mockTasks },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useTasks>)

    render(<Issues />)
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })

  it('should not render IssuesList when data is undefined', () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useTasks>)

    render(<Issues />)
    
    expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
  })
})


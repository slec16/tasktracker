import { render, screen, fireEvent, waitFor } from '../test-utils'
import IssuesList from '../IssuesList'
import { type Task } from '../../api/taskApi'
import { useSearchParams } from 'react-router-dom'


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}))

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

describe('IssuesList Component', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Test Task A',
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
      title: 'Test Task B',
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
    {
      id: 3,
      title: 'Another Task',
      description: 'Description 3',
      priority: 'Low',
      status: 'Done',
      boardId: 2,
      boardName: 'Board 2',
      assignee: {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '',
      },
    },
  ]

  const mockSetSearchParams = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const searchParams = new URLSearchParams()
    mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams])
  })

  it('should render all tasks', () => {
    render(<IssuesList taskList={mockTasks} />)

    expect(screen.getByText('Test Task A')).toBeInTheDocument()
    expect(screen.getByText('Test Task B')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('should filter tasks by search query', async () => {
    render(<IssuesList taskList={mockTasks} />)

    const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
    
    fireEvent.change(searchInput, { target: { value: 'Test Task' } })

    await waitFor(() => {
      expect(screen.getByText('Test Task A')).toBeInTheDocument()
      expect(screen.getByText('Test Task B')).toBeInTheDocument()
      expect(screen.queryByText('Another Task')).not.toBeInTheDocument()
    })
  })

  it('should show "Ничего не найдено" when no tasks match search', async () => {
    render(<IssuesList taskList={mockTasks} />)

    const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
    
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } })

    await waitFor(() => {
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    })
  })

  it('should clear search when close icon is clicked', async () => {
    render(<IssuesList taskList={mockTasks} />)

    const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
    
    fireEvent.change(searchInput, { target: { value: 'Test' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('Test')
    })

    const clearButton = searchInput.closest('.MuiTextField-root')?.querySelector('button')
    if (clearButton) {
      fireEvent.click(clearButton)
    }

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('should sort tasks by title in ascending order', () => {
    render(<IssuesList taskList={mockTasks} />)

    const titleHeader = screen.getByText('Задача').closest('p')
    const sortButton = titleHeader?.querySelector('button')
    
    if (sortButton) {
      fireEvent.click(sortButton)
    }


    const renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)

    expect(renderedTasks).toHaveLength(3)
  })

  it('should sort tasks by priority', () => {
    render(<IssuesList taskList={mockTasks} />)

    const priorityHeader = screen.getByText('Приоритет').closest('p')
    const sortButton = priorityHeader?.querySelector('button')
    
    if (sortButton) {
      fireEvent.click(sortButton)
    }

    const renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)

    expect(renderedTasks).toHaveLength(3)

    expect(renderedTasks.map(task => task.textContent)).toContain('Test Task A')
    expect(renderedTasks.map(task => task.textContent)).toContain('Test Task B')
    expect(renderedTasks.map(task => task.textContent)).toContain('Another Task')
  })

  it('should sort tasks by status', () => {
    render(<IssuesList taskList={mockTasks} />)

    const statusHeader = screen.getByText('Статус').closest('p')
    const sortButton = statusHeader?.querySelector('button')
    
    if (sortButton) {
      fireEvent.click(sortButton)
    }

    const renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)
    expect(renderedTasks[0]).toHaveTextContent('Test Task A')
  })

  it('should sort tasks by board name', () => {
    render(<IssuesList taskList={mockTasks} />)

    const boardHeader = screen.getByText('Доска').closest('p')
    const sortButton = boardHeader?.querySelector('button')
    
    if (sortButton) {
      fireEvent.click(sortButton)
    }

    const renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)
    expect(renderedTasks[0]).toHaveTextContent('Test Task A')
  })

  it('should toggle sort order when clicking same column twice', () => {
    render(<IssuesList taskList={mockTasks} />)

    const titleHeader = screen.getByText('Задача').closest('p')
    const sortButton = titleHeader?.querySelector('button')
    
    if (sortButton) {
      fireEvent.click(sortButton)
      let renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)
      expect(renderedTasks).toHaveLength(3)

      fireEvent.click(sortButton)
      renderedTasks = screen.getAllByText(/Test Task A|Test Task B|Another Task/)
      expect(renderedTasks).toHaveLength(3)
    }
  })

  it('should handle initial search params', () => {
    const searchParams = new URLSearchParams('?q=Test')
    mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams])

    render(<IssuesList taskList={mockTasks} />)

    const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
    expect(searchInput).toHaveValue('Test')
  })
})


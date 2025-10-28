import { render, screen } from '../../utils/test-utils'
import Board from '../Board'
import { useBoard, useBoards } from '../../hooks/useBoards'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setRefetchFalse, type DrawerState } from '../../store/drawerSlice'

jest.mock('../../hooks/useBoards')
jest.mock('../../hooks/redux')
jest.mock('../../store/drawerSlice', () => {
  const actual = jest.requireActual('../../store/drawerSlice')
  return {
    ...actual,
    setRefetchFalse: jest.fn(() => ({ type: 'drawer/setRefetchFalse' })),
  }
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('../BoardTable', () => ({
  __esModule: true,
  default: () => <div data-testid="board-table">BoardTable</div>,
}))

const mockUseBoard = useBoard as jest.MockedFunction<typeof useBoard>
const mockUseBoards = useBoards as jest.MockedFunction<typeof useBoards>
const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>

describe('Board component', () => {
  const mockRefetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ id: '1' })
    mockUseBoards.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useBoards>)
    mockUseAppSelector.mockReturnValue({
      isOpen: false,
      drawerId: null,
      boardId: null,
      refetchState: false,
    } as DrawerState)
    mockUseAppDispatch.mockReturnValue(jest.fn())
  })

  it('renders loading spinner when loading', () => {
    mockUseBoard.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useBoard>)

    const { container } = render(<Board />)

    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders error message when error', () => {
    const errorMessage = 'Failed to fetch board'
    mockUseBoard.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { name: 'Error', message: errorMessage } as Error,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useBoard>)

    render(<Board />)

    expect(screen.getByText(`Ошибка: ${errorMessage}`)).toBeInTheDocument()
  })

  it('renders title, description and BoardTable when data is loaded', () => {
    const mockBoards = {
      data: [
        { id: 1, name: 'Board 1', description: 'Board description', taskCount: 3 },
      ],
    }
    const mockTasks = {
      data: [
        {
          id: 1,
          title: 'Backlog Task',
          description: 'desc',
          priority: 'High',
          status: 'Backlog',
          assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com', avatarUrl: '' },
        },
      ],
    }

    mockUseBoards.mockReturnValue({
      data: mockBoards,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useBoards>)

    mockUseBoard.mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useBoard>)

    render(<Board />)

    expect(screen.getByText('Board 1')).toBeInTheDocument()
    expect(screen.getByText('Board description')).toBeInTheDocument()
    expect(screen.getByTestId('board-table')).toBeInTheDocument()
  })

  it('calls refetch and dispatches setRefetchFalse when refetchState is true', () => {
    const dispatchMock = jest.fn()
    mockUseAppDispatch.mockReturnValue(dispatchMock)
    mockUseAppSelector.mockReturnValue({
      isOpen: false,
      drawerId: null,
      boardId: null,
      refetchState: true,
    } as DrawerState)

    mockUseBoards.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useBoards>)

    const refetchSpy = jest.fn()
    mockUseBoard.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: refetchSpy,
    } as unknown as ReturnType<typeof useBoard>)

    render(<Board />)

    expect(refetchSpy).toHaveBeenCalled()
    expect(dispatchMock).toHaveBeenCalledWith((setRefetchFalse as unknown as jest.Mock)())
  })
})



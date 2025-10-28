import { render, screen } from "../../utils/test-utils"
import Boards from "../Boards"
import { useBoards } from "../../hooks/useBoards"
import { type Board } from '../../api/boardApi'

jest.mock('../../hooks/useBoards')

const mockUseBoards = useBoards as jest.MockedFunction<typeof useBoards>

describe('Boards component', () => {
    const mockBoards: Board[] = [
        {
            id: 1,
            name: 'Board 1',
            description: 'Desc for board 1',
            taskCount: 5
        },
        {
            id: 2,
            name: 'Board 2',
            description: 'Desc for board 2',
            taskCount: 10
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render loading spinner when isLoading is true', () => {
        mockUseBoards.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null
        } as ReturnType<typeof useBoards>)

        const { container } = render(<Boards />)

        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toBeInTheDocument()
    })

    it('should render error message when isError is true', () => {
        const errorMessage = 'Failed to fetch tasks'
        mockUseBoards.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: { message: errorMessage, name: 'Error' } as Error,
        } as ReturnType<typeof useBoards>)

        render(<Boards />)

        expect(screen.getByText(`Ошибка: ${errorMessage}`)).toBeInTheDocument()
    })

    it('should render BoardsList when data is loaded', () => {
        mockUseBoards.mockReturnValue({
            data: { data: mockBoards },
            isLoading: false,
            isError: false,
            error: null,
        } as ReturnType<typeof useBoards>)

        render(<Boards />)

        expect(screen.getByText('Board 1')).toBeInTheDocument()
        expect(screen.getByText('Board 2')).toBeInTheDocument()
    })

    it('should not render BoardsList when data is undefined', () => {
        mockUseBoards.mockReturnValue({
            data: { data: [] as Board[] },
            isLoading: false,
            isError: false,
            error: null,
        } as ReturnType<typeof useBoards>)

        render(<Boards />)

        expect(screen.queryByText('Board 1')).not.toBeInTheDocument()
    })

})
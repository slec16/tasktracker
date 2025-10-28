import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import BoardsList from '../BoardsList'
import { type Board } from '../../api/boardApi'


const mockSetSearchParams = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: () => [
        new URLSearchParams(''),
        mockSetSearchParams
    ],
}))

describe('BoardsList Component', () => {
    const mockBoards: Board[] = [
        {
            id: 1,
            name: 'Board A',
            description: 'First board desc',
            taskCount: 5,
        },
        {
            id: 2,
            name: 'Board B',
            description: 'Second board desc',
            taskCount: 3,
        },
        {
            id: 3,
            name: 'Board C',
            description: 'Third board desc',
            taskCount: 8,
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render all boards', () => {
        render(<BoardsList boardsList={mockBoards} />)

        expect(screen.getByText('Board A')).toBeInTheDocument()
        expect(screen.getByText('Board B')).toBeInTheDocument()
        expect(screen.getByText('Board C')).toBeInTheDocument()
    })

    it('should filter boards by name when searching', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
        fireEvent.change(searchInput, { target: { value: 'Board A' } })

        await waitFor(() => {
            expect(screen.getByText('Board A')).toBeInTheDocument()
            expect(screen.queryByText('Board B')).not.toBeInTheDocument()
            expect(screen.queryByText('Board C')).not.toBeInTheDocument()
        })
    })

    it('should show "Ничего не найдено" when no boards match search', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
        fireEvent.change(searchInput, { target: { value: 'NonExistent' } })

        await waitFor(() => {
            expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
        })
    })

    it('should clear search when clear button is clicked', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
        fireEvent.change(searchInput, { target: { value: 'Board A' } })

        await waitFor(() => {
            expect(screen.queryByText('Board B')).not.toBeInTheDocument()
        })

        const clearButton = searchInput.closest('.MuiTextField-root')?.querySelector('button')
        if (clearButton) {
            fireEvent.click(clearButton)
        }

        await waitFor(() => {
            expect(screen.getByText('Board A')).toBeInTheDocument()
            expect(screen.getByText('Board B')).toBeInTheDocument()
            expect(screen.getByText('Board C')).toBeInTheDocument()
        })
    })

    it('should sort boards by name in ascending order by default', () => {
        render(<BoardsList boardsList={mockBoards} />)

        const boardElements = screen.getAllByRole('link')
        const firstBoard = boardElements[0]
        expect(firstBoard).toHaveTextContent('Board A')
    })

    it('should sort boards by name', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const priorityName = screen.getByText('Доска').closest('p')
        const sortButton = priorityName?.querySelector('button')

        if (sortButton) {
            fireEvent.click(sortButton)
        }

        const boardElements = screen.getAllByRole('link')


        const firstBoard = boardElements[0]
        expect(firstBoard.textContent).toContain('Board C')
    })

    it('should sort boards by task count', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const priorityName = screen.getByText('Количество задач').closest('p')
        const sortButton = priorityName?.querySelector('button')

        if (sortButton) {
            fireEvent.click(sortButton)
        }

        const boardElements = screen.getAllByRole('link')


        const firstBoard = boardElements[0]
        expect(firstBoard.textContent).toContain('Board B')
    })

    it('should sort boards by description', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const priorityName = screen.getByText('Описание').closest('p')
        const sortButton = priorityName?.querySelector('button')

        if (sortButton) {
            fireEvent.click(sortButton)

        }

        const boardElements = screen.getAllByRole('link')


        const firstBoard = boardElements[0]
        expect(firstBoard.textContent).toContain('Board A')
    })

    it('should handle empty boards list', () => {
        render(<BoardsList boardsList={[]} />)

        expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    })

    it('should update URL search params when searching', async () => {
        render(<BoardsList boardsList={mockBoards} />)

        const searchInput = screen.getByPlaceholderText('Поиск задач по названию...')
        fireEvent.change(searchInput, { target: { value: 'Board A' } })

        await waitFor(() => {
            expect(mockSetSearchParams).toHaveBeenCalled()
        })
    })


})
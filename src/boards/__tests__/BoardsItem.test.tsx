import { render, screen } from '../../utils/test-utils'
import BoardsItem from '../BoardsItem'
import { type Board } from '../../api/boardApi'

describe('BoardsItem Component', () => {
    const mockBoard: Board = {
        id: 1,
        name: 'Test Board',
        description: 'Test Description',
        taskCount: 5,
    }

    it('should render board name', () => {
        render(<BoardsItem boardData={mockBoard} />)

        expect(screen.getByText('Test Board')).toBeInTheDocument()
    })

    it('should render board description', () => {
        render(<BoardsItem boardData={mockBoard} />)

        expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should render task count', () => {
        render(<BoardsItem boardData={mockBoard} />)

        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render as a link with correct href', () => {
        render(<BoardsItem boardData={mockBoard} />)

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/board/1')
    })

})
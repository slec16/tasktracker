import { render as rtlRender, screen, fireEvent } from '@testing-library/react'
import TabsRouter from '../TabsRouter'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../../store'
import { ThemeProvider } from '../../context/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { closeDrawer } from '../../store/drawerSlice'

const renderWithRoute = (route: string) => {
  const queryClient = new QueryClient()
  return rtlRender(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <MemoryRouter initialEntries={[route]}>
            <TabsRouter />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

describe('TabsRouter component', () => {
  beforeEach(() => {
    store.dispatch(closeDrawer())
  })

  it('selects "Все задачи" tab on /issues', () => {
    renderWithRoute('/issues')
    const issuesTab = screen.getByRole('tab', { name: 'Все задачи' })
    const boardsTab = screen.getByRole('tab', { name: 'Проекты' })
    expect(issuesTab).toHaveAttribute('aria-selected', 'true')
    expect(boardsTab).toHaveAttribute('aria-selected', 'false')
  })

  it('selects "Проекты" tab on /boards', () => {
    renderWithRoute('/boards')
    const issuesTab = screen.getByRole('tab', { name: 'Все задачи' })
    const boardsTab = screen.getByRole('tab', { name: 'Проекты' })
    expect(boardsTab).toHaveAttribute('aria-selected', 'true')
    expect(issuesTab).toHaveAttribute('aria-selected', 'false')
  })

  it('selects "Проекты" tab on /board/:id', () => {
    renderWithRoute('/board/123')
    const boardsTab = screen.getByRole('tab', { name: 'Проекты' })
    expect(boardsTab).toHaveAttribute('aria-selected', 'true')
  })

  it('selects "Все задачи" tab on /', () => {
    renderWithRoute('/')
    const issuesTab = screen.getByRole('tab', { name: 'Все задачи' })
    expect(issuesTab).toHaveAttribute('aria-selected', 'true')
  })

  it('dispatches openDrawer on "Создать задачу" click', () => {
    renderWithRoute('/')
    const createBtn = screen.getByRole('button', { name: 'Создать задачу' })
    fireEvent.click(createBtn)
    expect(store.getState().drawer.isOpen).toBe(true)
  })
})



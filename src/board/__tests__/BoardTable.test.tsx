import { render, screen, act, waitFor } from '../../utils/test-utils'
import BoardTable from '../BoardTable'

let mockMutate: jest.Mock<void, [unknown, { onSuccess?: () => void; onError?: () => void }]>
let lastOnDragEnd: ((e: unknown) => void) | null = null

jest.mock('../../hooks/useTasks', () => ({
  useUpdateTaskStatus: () => ({
    mutate: (vars: unknown, options: { onSuccess?: () => void; onError?: () => void }) => mockMutate(vars, options),
  }),
}))

jest.mock('@dnd-kit/core', () => {
  return {
    DndContext: ({ onDragEnd, children }: { onDragEnd: (e: unknown) => void; children: React.ReactNode }) => {
      lastOnDragEnd = onDragEnd
      return <div data-testid="dnd-context">{children}</div>
    },
    useSensor: () => ({}),
    useSensors: (...args: unknown[]) => args,
    PointerSensor: function PointerSensor() {},
    TouchSensor: function TouchSensor() {},
    KeyboardSensor: function KeyboardSensor() {},
    useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: jest.fn(), transform: null }),
    useDndContext: () => ({ active: null }),
    useDroppable: () => ({ isOver: false, setNodeRef: jest.fn() }),
    __triggerDragEnd: (event: unknown) => {
      if (lastOnDragEnd) lastOnDragEnd(event)
    },
  }
})

// Helper to trigger drag end from the mocked dnd-kit
const triggerDragEnd = (event: unknown) => {
  const core = require('@dnd-kit/core') as { __triggerDragEnd: (event: unknown) => void }
  core.__triggerDragEnd(event)
}

describe('BoardTable component', () => {
  const onRefresh = jest.fn()

  const baseTasks = [
    {
      id: 1,
      title: 'Backlog Task',
      description: 'desc',
      priority: 'High',
      status: 'Backlog',
      assignee: { id: 1, fullName: 'John Doe', email: 'john@example.com', avatarUrl: '' },
    },
    {
      id: 2,
      title: 'InProgress Task',
      description: 'desc',
      priority: 'Medium',
      status: 'InProgress',
      assignee: { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', avatarUrl: '' },
    },
    {
      id: 3,
      title: 'Done Task',
      description: 'desc',
      priority: 'Low',
      status: 'Done',
      assignee: { id: 3, fullName: 'Alex Roe', email: 'alex@example.com', avatarUrl: '' },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockMutate = jest.fn()
  })

  it('renders three columns and groups tasks with correct counts', () => {
    render(<BoardTable boardTasks={baseTasks} onRefresh={onRefresh} />)

    expect(screen.getByText('Backlog Task')).toBeInTheDocument()
    expect(screen.getByText('InProgress Task')).toBeInTheDocument()
    expect(screen.getByText('Done Task')).toBeInTheDocument()

    const backlogHeader = screen.getByText('Бэклог').closest('h2')!
    const inProgressHeader = screen.getByText('В процессе').closest('h2')!
    const doneHeader = screen.getByText('Выполнено').closest('h2')!

    expect(backlogHeader.querySelector('span')?.textContent).toBe('1')
    expect(inProgressHeader.querySelector('span')?.textContent).toBe('1')
    expect(doneHeader.querySelector('span')?.textContent).toBe('1')
  })

  it('updates status to Backlog when dragging from InProgress to backlog', async () => {
    mockMutate.mockImplementation((_vars: unknown, options: { onSuccess?: () => void }) => {
      act(() => {
        options?.onSuccess?.()
        onRefresh()
      })
    })

    render(<BoardTable boardTasks={baseTasks} onRefresh={onRefresh} />)

    act(() => {
      triggerDragEnd({
        over: { id: 'backlog' },
        active: { id: 2, data: { current: { status: 'InProgress' } } },
      })
    })

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 2, taskStatus: { status: 'Backlog' } },
      expect.any(Object)
    )
    
    await waitFor(() => {
      expect(screen.getByText('Статус задачи успешно изменен')).toBeInTheDocument()
    })
    expect(onRefresh).toHaveBeenCalled()
  })

  it('shows error snackbar when mutation fails', async () => {
    mockMutate.mockImplementation((_vars: unknown, options: { onError?: () => void }) => {
      act(() => {
        options?.onError?.()
      })
    })

    render(<BoardTable boardTasks={baseTasks} onRefresh={onRefresh} />)

    act(() => {
      triggerDragEnd({
        over: { id: 'inprogress' },
        active: { id: 1, data: { current: { status: 'Backlog' } } },
      })
    })

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 1, taskStatus: { status: 'InProgress' } },
      expect.any(Object)
    )
    
    await waitFor(() => {
      expect(screen.getByText('Статус задачи не удалось измененить')).toBeInTheDocument()
    })
  })



  it('updates status from InProgress to Done when dragging to done column', async () => {
    mockMutate.mockImplementation((_vars: unknown, options: { onSuccess?: () => void }) => {
      act(() => {
        options?.onSuccess?.()
        onRefresh()
      })
    })

    render(<BoardTable boardTasks={baseTasks} onRefresh={onRefresh} />)

    act(() => {
      triggerDragEnd({
        over: { id: 'done' },
        active: { id: 2, data: { current: { status: 'InProgress' } } },
      })
    })

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 2, taskStatus: { status: 'Done' } },
      expect.any(Object)
    )
    
    await waitFor(() => {
      expect(screen.getByText('Статус задачи успешно изменен')).toBeInTheDocument()
    })
    expect(onRefresh).toHaveBeenCalled()
  })
})



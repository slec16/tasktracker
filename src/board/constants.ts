
// Статусы задач
export const TASK_STATUS = {
    BACKLOG: 'Backlog',
    IN_PROGRESS: 'InProgress',
    DONE: 'Done',
} as const

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]


// Маппинг droppable ID к статусам задач
export const DROPPABLE_ID_TO_STATUS: Record<string, TaskStatus> = {
    backlog: TASK_STATUS.BACKLOG,
    inprogress: TASK_STATUS.IN_PROGRESS,
    done: TASK_STATUS.DONE,
} as const

// Маппинг статусов к droppable ID
export const STATUS_TO_DROPPABLE_ID: Record<TaskStatus, string> = {
    [TASK_STATUS.BACKLOG]: 'backlog',
    [TASK_STATUS.IN_PROGRESS]: 'inprogress',
    [TASK_STATUS.DONE]: 'done',
} as const

//  Статус задачи из droppable ID
export const getStatusFromDroppableId = (droppableId: string | undefined): TaskStatus | null => {
    if (!droppableId) return null
    return DROPPABLE_ID_TO_STATUS[droppableId] || null
}

// Конфигурация колонок доски
export interface BoardColumn {
    id: string
    status: TaskStatus
    title: string
}

export const BOARD_COLUMNS: BoardColumn[] = [
    {
        id: 'backlog',
        status: TASK_STATUS.BACKLOG,
        title: 'Бэклог',
    },
    {
        id: 'inprogress',
        status: TASK_STATUS.IN_PROGRESS,
        title: 'В процессе',
    },
    {
        id: 'done',
        status: TASK_STATUS.DONE,
        title: 'Выполнено',
    },
] as const

// Конфигурация колонки по статусу
export const getColumnByStatus = (status: TaskStatus): BoardColumn | undefined => {
    return BOARD_COLUMNS.find((column) => column.status === status)
}

// Колонка по id
export const getColumnById = (id: string): BoardColumn | undefined => {
    return BOARD_COLUMNS.find((column) => column.id === id)
}
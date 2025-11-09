import { useState, useCallback } from 'react'
import { type DragEndEvent } from '@dnd-kit/core'
import { type BoardTasks } from '../api/boardApi'
import { useUpdateTaskStatus } from './useTasks'
import { getStatusFromDroppableId } from '../../src/board/constants'

type UseDragAndDropOptions = {
    boardTasks: BoardTasks[]
    onRefresh: () => void
}

type UseDragAndDropReturn = {
    handleDragEnd: (event: DragEndEvent) => void
    openSuccessSnackbar: boolean
    openErrorSnackbar: boolean
    handleSuccessClose: () => void
    handleErrorClose: () => void
}

export const useDragAndDrop = ({ boardTasks, onRefresh }: UseDragAndDropOptions): UseDragAndDropReturn => {

    const { mutate } = useUpdateTaskStatus()
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)

    const handleSuccessClose = useCallback(() => {
        setOpenSuccessSnackbar(false)
    }, [])

    const handleErrorClose = useCallback(() => {
        setOpenErrorSnackbar(false)
    }, [])

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { over, active } = event

            // Новый статус из droppable ID
            const newStatus = getStatusFromDroppableId(over?.id as string)
            if (!newStatus) return

            // Текущий статус задачи из data
            const currentStatus = active.data.current?.status as string
            if (!currentStatus) return

            // Если статус не изменился, ничего не делаем
            if (currentStatus === newStatus) return

            // Задача по ID
            const task = boardTasks.find((t) => String(t.id) === String(active.id))
            if (!task) return

            // Обновляем статус задачи
            mutate(
                {
                    id: task.id,
                    taskStatus: {
                        status: newStatus,
                    },
                },
                {
                    onSuccess: () => {
                        setOpenSuccessSnackbar(true)
                        onRefresh()
                    },
                    onError: () => {
                        setOpenErrorSnackbar(true)
                    },
                }
            )
        },
        [boardTasks, mutate, onRefresh]
    )

    return {
        handleDragEnd,
        openSuccessSnackbar,
        openErrorSnackbar,
        handleSuccessClose,
        handleErrorClose,
    }
}
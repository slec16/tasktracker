import { useRef, useMemo } from 'react'
import { type BoardTasks } from '../api/boardApi'
import BoardTableCard from './BoardTableCard'
import { DndContext, useSensor, PointerSensor, TouchSensor, KeyboardSensor, useSensors } from '@dnd-kit/core'
import { Droppable } from './Droppable'
import Snackbar from '@mui/material/Snackbar'
import { restrictToElement } from './restrictToElement'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { TASK_STATUS, BOARD_COLUMNS } from './constants'

type BoardTableType = {
    boardTasks: BoardTasks[]
    onRefresh: () => void
}

const BoardTable = (props: BoardTableType) => {

    const { boardTasks, onRefresh } = props

    const {
        handleDragEnd,
        openSuccessSnackbar,
        openErrorSnackbar,
        handleErrorClose,
        handleSuccessClose
    } = useDragAndDrop({
        boardTasks,
        onRefresh
    })

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 10
        },
    })

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 10
        },
    })

    const keyboardSensor = useSensor(KeyboardSensor)

    const sensors = useSensors(
        pointerSensor,
        touchSensor,
        keyboardSensor
    )

    const containerRef = useRef<HTMLDivElement | null>(null)

    const taskByStatus = useMemo(() => {
        const group: Record<string, BoardTasks[]> = {
            [TASK_STATUS.BACKLOG]: [],
            [TASK_STATUS.DONE]: [],
            [TASK_STATUS.IN_PROGRESS]: []
        }

        boardTasks.forEach((task) => {
            if (task.status in group) {
                group[task.status].push(task)
            }
        })

        return group
    }, [boardTasks])


    return (
        <>
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-6">
                    {BOARD_COLUMNS.map((column) => {
                        const tasks = taskByStatus[column.status] || []
                        const isEmpty = tasks.length === 0

                        return (
                            <div
                                key={column.id}
                                className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${isEmpty && 'rounded-b-md'} rounded-t-md border-b`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                                    {column.title}
                                    <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                                        {tasks.length}
                                    </span>
                                </h2>
                            </div>
                        )
                    })}
                </div>

                {/* Table columns */}
                <div ref={containerRef} className="grid grid-cols-3 gap-6 ">

                    <DndContext onDragEnd={handleDragEnd} sensors={sensors} modifiers={[restrictToElement(() => containerRef.current)]}>
                        {BOARD_COLUMNS.map((column) => {
                            const tasks = taskByStatus[column.status] || []
                            const isEmpty = tasks.length === 0

                            return (
                                <Droppable key={column.id} id={column.id}>
                                    <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${!isEmpty ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                                        {tasks.map((task) => (
                                            <BoardTableCard task={task} key={task.id} />
                                        ))}
                                    </div>
                                </Droppable>
                            )
                        })}

                    </DndContext>

                </div>


            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSuccessSnackbar}
                autoHideDuration={3000}
                onClose={handleSuccessClose}
                message="Статус задачи успешно изменен"
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#4caf50', // зеленый цвет
                        color: '#fff'
                    }
                }}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openErrorSnackbar}
                autoHideDuration={3000}
                onClose={handleErrorClose}
                message="Статус задачи не удалось измененить"
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#d21616', // красный цвет
                        color: '#fff'
                    }
                }}
            />
        </>
    )
}

export default BoardTable


import { useEffect, useState } from 'react'
import { type BoardTasks } from '../api/boardApi'
import { useUpdateTaskStatus } from '../hooks/useTasks'
import BoardTableCard from './BoardTableCard'
import { DndContext, type DragEndEvent, useSensor, PointerSensor, TouchSensor, KeyboardSensor, useSensors } from '@dnd-kit/core'
import { Droppable } from './Droppable'
import Snackbar from '@mui/material/Snackbar'

type BoardTableType = {
    boardTasks: BoardTasks[]
    onRefresh: () => void
}

const BoardTable = (props: BoardTableType) => {

    const { boardTasks, onRefresh } = props
    const { data: response, mutate } = useUpdateTaskStatus()
    // const sensor = useSensor(MouseSensor, {
    //   // Press delay of 250ms, with tolerance of 5px of movement
    //   activationConstraint: {
    //     delay: 500,
    //     distance: 10,
    //   },
    // })

const pointerSensor = useSensor(PointerSensor, {
  activationConstraint: {
    delay: 500,
    distance: 10,
  },
});

const touchSensor = useSensor(TouchSensor, {
  activationConstraint: {
    delay: 500,
    distance: 10,
  },
});

const keyboardSensor = useSensor(KeyboardSensor);

const sensors = useSensors(
  pointerSensor,
  touchSensor,
  keyboardSensor
);

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false)
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)

    const [backlogTasks, setBacklogTasks] = useState<BoardTasks[]>([])
    const [inProgressTasks, setInProgressTasks] = useState<BoardTasks[]>([])
    const [doneTasks, setDoneTasks] = useState<BoardTasks[]>([])

    const handleSuccessClose = () => {
        setOpenSuccessSnackbar(false)
    }

    const handleErrorClose = () => {
        setOpenErrorSnackbar(false)
    }

    useEffect(() => {
        setBacklogTasks(() => {
            return boardTasks.filter(task => task.status === 'Backlog')
        })
        setInProgressTasks(() => {
            return boardTasks.filter(task => task.status === 'InProgress')
        })
        setDoneTasks(() => {
            return boardTasks.filter(task => task.status === 'Done')
        })
    }, [props])

    // TODO - перенос карточки в свою же колонку

    function handleDragEnd(event: DragEndEvent) {
        const { over, active } = event  // over - куда, active - кого
        console.log(over, active.data.current)

        switch (over?.id) {
            case 'backlog': //куда
                switch (active.data.current?.status as unknown as string) {
                    case 'InProgress':
                        const taskFromProgress = boardTasks.find(task => task.id == active.id)
                        taskFromProgress && mutate(
                            {
                                id: taskFromProgress?.id,
                                taskStatus: {
                                    status: 'Backlog'
                                }
                            }, {
                            onSuccess: () => {
                                // setInProgressTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromProgress && setBacklogTasks((prev) => [...prev, taskFromProgress])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                    case 'Done':
                        const taskFromDone = boardTasks.find(task => task.id == active.id)
                        taskFromDone && mutate({
                            id: taskFromDone.id,
                            taskStatus: {
                                status: 'Backlog'
                            }
                        }, {
                            onSuccess: () => {
                                // setDoneTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromDone && setBacklogTasks((prev) => [...prev, taskFromDone])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                }
                break
            case 'inprogress': //куда
                switch (active.data.current?.status as unknown as string) {
                    case 'Backlog':
                        const taskFromBacklog = boardTasks.find(task => task.id == active.id)
                        taskFromBacklog && mutate({
                            id: taskFromBacklog.id,
                            taskStatus: {
                                status: 'InProgress'
                            }
                        }, {
                            onSuccess: () => {
                                // setBacklogTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromBacklog && setInProgressTasks((prev) => [...prev, taskFromBacklog])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                    case 'Done':
                        const taskFromDone = boardTasks.find(task => task.id == active.id)
                        taskFromDone && mutate({
                            id: taskFromDone.id,
                            taskStatus: {
                                status: 'InProgress'
                            }
                        }, {
                            onSuccess: () => {
                                // setDoneTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromDone && setInProgressTasks((prev) => [...prev, taskFromDone])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                }
                break
            case 'done': //куда
                switch (active.data.current?.status as unknown as string) {
                    case 'Backlog':
                        const taskFromBacklog = boardTasks.find(task => task.id == active.id)
                        taskFromBacklog && mutate({
                            id: taskFromBacklog.id,
                            taskStatus: {
                                status: 'Done'
                            }
                        }, {
                            onSuccess: () => {
                                // setBacklogTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromBacklog && setDoneTasks((prev) => [...prev, taskFromBacklog])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                    case 'InProgress':
                        const taskFromProgress = boardTasks.find(task => task.id == active.id)
                        taskFromProgress && mutate({
                            id: taskFromProgress.id,
                            taskStatus: {
                                status: 'Done'
                            }
                        }, {
                            onSuccess: () => {
                                // setInProgressTasks(prev => prev.filter(task => task.id != active.id))
                                // taskFromProgress && setDoneTasks((prev) => [...prev, taskFromProgress])
                                setOpenSuccessSnackbar(true)
                                onRefresh()
                            },
                            onError: () => {
                                setOpenErrorSnackbar(true)
                            }
                        }
                        )
                        break
                }
                break
        }
    }



    return (
        <>
            <div className="w-full h-full px-5">
                <div className="mb-6">
                    {/* Name */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Title</h1>
                    {/* description */}
                    <p className="text-gray-600 dark:text-gray-400">description</p>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-3 gap-6">
                    <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${backlogTasks.length == 0 && 'rounded-b-md'} rounded-t-md border-b`}>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                            Бэклог
                            <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                                {backlogTasks.length}
                            </span>
                        </h2>
                    </div>
                    <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${inProgressTasks.length == 0 && 'rounded-b-md'} rounded-t-md border-b`}>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                            В процессе
                            <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                                {inProgressTasks.length}
                            </span>
                        </h2>
                    </div>
                    <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${doneTasks.length == 0 && 'rounded-b-md'} rounded-t-md border-b`}>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                            Выполнено
                            <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                                {doneTasks.length}
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Table columns */}
                <div className="grid grid-cols-3 gap-6">

                    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>

                        <Droppable key={'backlog'} id={'backlog'}>
                            <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${backlogTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                                {backlogTasks.map((task) => (
                                    <BoardTableCard task={task} key={task.id} />
                                ))}
                            </div>
                        </Droppable>

                        <Droppable key={'inprogress'} id={'inprogress'}>
                            <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${inProgressTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                                {inProgressTasks.map((task) => (
                                    <BoardTableCard task={task} key={task.id} />
                                ))}
                            </div>
                        </Droppable>

                        <Droppable key={'done'} id={'done'}>
                            <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${doneTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                                {doneTasks.map((task) => (
                                    <BoardTableCard task={task} key={task.id} />
                                ))}
                            </div>
                        </Droppable>

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


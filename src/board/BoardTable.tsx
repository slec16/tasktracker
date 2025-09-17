import { useEffect, useState } from 'react'
import { type BoardTasks } from '../api/boardApi'
import BoardTableCard from './BoardTableCard'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { Droppable } from './Droppable'

type BoardTableType = {
    boardTasks: BoardTasks[]
}

const BoardTable = (props: BoardTableType) => {

    const { boardTasks } = props


    const [backlogTasks, setBacklogTasks] = useState<BoardTasks[]>([])
    const [inProgressTasks, setInProgressTasks] = useState<BoardTasks[]>([])
    const [doneTasks, setDoneTasks] = useState<BoardTasks[]>([])


    useEffect(() => {
        console.log('comp render')
    }, [])

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

    function handleDragEnd(event: DragEndEvent) {
        const { over, active } = event
        console.log(over, active.data.current)

        switch(over?.id) {
            case 'backlog':
                switch(active.data.current?.status as unknown as string) {
                    case 'InProgress': 
                        setInProgressTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromProgress= boardTasks.find(task => task.id == active.id)
                        taskFromProgress && setBacklogTasks((prev) => [...prev, taskFromProgress])
                        break
                    case 'Done':
                        setDoneTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromDone = boardTasks.find(task => task.id == active.id)
                        taskFromDone && setBacklogTasks((prev) => [...prev, taskFromDone])
                        break
                }   
                break
            case 'inprogress':
                switch(active.data.current?.status as unknown as string){
                    case 'Backlog': 
                        setBacklogTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromBacklog= boardTasks.find(task => task.id == active.id)
                        taskFromBacklog && setInProgressTasks((prev) => [...prev, taskFromBacklog])
                        break
                    case 'Done':
                        setDoneTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromDone = boardTasks.find(task => task.id == active.id)
                        taskFromDone && setInProgressTasks((prev) => [...prev, taskFromDone])
                        break
                }
                break
            case 'done':
                switch(active.data.current?.status as unknown as string){
                    case 'Backlog': 
                        setBacklogTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromBacklog= boardTasks.find(task => task.id == active.id)
                        taskFromBacklog && setDoneTasks((prev) => [...prev, taskFromBacklog])
                        break
                    case 'InProgress':
                        setInProgressTasks(prev => prev.filter(task => task.id != active.id))
                        const taskFromProgress = boardTasks.find(task => task.id == active.id)
                        taskFromProgress && setDoneTasks((prev) => [...prev, taskFromProgress])
                        break
                }
                break
        }
    }




    return (
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

                <DndContext onDragEnd={handleDragEnd}>

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
    )
}

export default BoardTable


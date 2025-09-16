import { useEffect, useState } from 'react'
import { type BoardTasks } from '../api/boardApi'
import BoardTableCard from './BoardTableCard'

type BoardTableType = {
    boardTasks: BoardTasks[]
}

const BoardTable = (props: BoardTableType) => {

    const { boardTasks } = props

    console.log(boardTasks)

    const [backlogTasks, setBacklogTasks] = useState<BoardTasks[]>([])
    const [inProgressTasks, setInProgressTasks] = useState<BoardTasks[]>([])
    const [doneTasks, setDoneTasks] = useState<BoardTasks[]>([])

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
                <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${backlogTasks.length == 0 && 'rounded-b-md' } rounded-t-md border-b`}>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                        Бэклог
                        <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                            {backlogTasks.length}
                        </span>
                    </h2>
                </div>
                <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${inProgressTasks.length == 0 && 'rounded-b-md' } rounded-t-md border-b`}>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                        В процессе
                        <span className="bg-blue-300 dark:bg-orange-500 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                            {inProgressTasks.length}
                        </span>
                    </h2>
                </div>
                <div className={`p-4 bg-gray-300 dark:bg-[#333333] border-gray-200 dark:border-gray-600 ${doneTasks.length == 0 && 'rounded-b-md' } rounded-t-md border-b`}>
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

                <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${backlogTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                    {backlogTasks.map((task) => (
                        <BoardTableCard task={task} key={task.id}/>
                    ))}
                </div>

                <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${inProgressTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                    {inProgressTasks.map((task) => (
                        <BoardTableCard task={task} key={task.id}/>
                    ))}
                </div>

                <div className={`flex flex-col gap-y-2 w-full h-fit bg-gray-300 dark:bg-[#333333] ${doneTasks.length > 0 ? 'py-5 px-1' : 'p-0'} rounded-b-md`}>
                    {doneTasks.map((task) => (
                        <BoardTableCard task={task} key={task.id}/>
                    ))}
                </div>

            </div>


        </div>
    )
}

export default BoardTable

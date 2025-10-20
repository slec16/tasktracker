import { type Task } from "../api/taskApi"
import IssuesItem from "./IssuesItem"
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { useMemo, useState } from "react"

type IssuesListProps = {
    taskList: Task[]
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList } = props

    type SortKey = 'title' | 'priority' | 'status' | 'boardName' | 'assigneeFullName'

    const [sortKey, setSortKey] = useState<SortKey>('title')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    const priorityOrder: Record<string, number> = {
        Low: 1,
        Medium: 2,
        High: 3,
    }

    const statusOrder: Record<string, number> = {
        Backlog: 1,
        InProgress: 2,
        Done: 3,
    }

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const sortedTasks = useMemo(() => {
        const copy = [...taskList]
        copy.sort((a, b) => {
            let aVal: string | number = ''
            let bVal: string | number = ''

            switch (sortKey) {
                case 'title':
                    aVal = a.title
                    bVal = b.title
                    break
                case 'priority':
                    aVal = priorityOrder[a.priority] ?? 0
                    bVal = priorityOrder[b.priority] ?? 0
                    break
                case 'status':
                    aVal = statusOrder[a.status] ?? 0
                    bVal = statusOrder[b.status] ?? 0
                    break
                case 'boardName':
                    aVal = a.boardName
                    bVal = b.boardName
                    break
                case 'assigneeFullName':
                    aVal = a.assignee.fullName
                    bVal = b.assignee.fullName
                    break
                default:
                    break
            }

            let compareResult = 0
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                compareResult = aVal - bVal
            } else {
                compareResult = String(aVal).localeCompare(String(bVal))
            }

            return sortOrder === 'asc' ? compareResult : -compareResult
        })
        return copy
    }, [taskList, sortKey, sortOrder])

    return (
        <div className="flex flex-col gap-y-3 px-10">
            {/* table header */}
            <div className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 
                dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 
                grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-4 items-center shadow-sm">
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Задача
                    <button onClick={() => toggleSort('title')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Приоритет
                    <button onClick={() => toggleSort('priority')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Статус
                    <button onClick={() => toggleSort('status')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Доска
                    <button onClick={() => toggleSort('boardName')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Ответственный
                    <button onClick={() => toggleSort('assigneeFullName')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
            </div>
            {sortedTasks.map((task) => (
                <IssuesItem
                    key={task.id}
                    taskData={task}
                />
            ))}

        </div>
    )
}

export default IssuesList
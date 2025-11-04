import { type Task } from "../api/taskApi"
import IssuesItem from "./IssuesItem"
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { useSearchParams } from 'react-router-dom'
import { TextField, InputAdornment, IconButton as MIconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useState } from "react"
import { List } from "react-window"

type IssuesListProps = {
    taskList: Task[]
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList } = props
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQuery = (searchParams.get('q') || '')
    const [queryInput, setQueryInput] = useState(initialQuery)
    const query = queryInput.trim().toLowerCase()

    useEffect(() => {
        const handler = setTimeout(() => {
            const next = new URLSearchParams(searchParams)
            if (queryInput && queryInput.trim().length > 0) {
                next.set('q', queryInput)
            } else {
                next.delete('q')
            }
            setSearchParams(next, { replace: true })
        }, 250)
        return () => clearTimeout(handler)
    }, [queryInput, searchParams, setSearchParams])

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

    const filteredTasks = useMemo(() => {
        if (!query) return sortedTasks
        return sortedTasks.filter(t => t.title.toLowerCase().includes(query))
    }, [sortedTasks, query])

    return (
        <div className="flex flex-1 h-full flex-col overflow-hidden gap-y-3 px-10">
            <div className="w-full self-start">
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Поиск задач по названию..."
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '9999px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '9999px',
                                borderWidth: 2
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 2
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 2
                            }
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: queryInput ? (
                                <InputAdornment position="end">
                                    <MIconButton size="small" onClick={() => setQueryInput('')}>
                                        <CloseIcon fontSize="small" />
                                    </MIconButton>
                                </InputAdornment>
                            ) : undefined
                        }
                    }}
                />
            </div>
            {/* table header */}
            <div className="w-full py-4 px-6 rounded-lg bg-gray-100 border border-gray-200 dark:bg-[#444444] dark:border-[#2c2c2c]
                            grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-4 items-center shadow-sm"
            >
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

            {filteredTasks.length == 0 ?
                <p className="text-center text-2xl font-semibold py-5 text-sky-600 dark:text-orange-400">Ничего не найдено</p>
                :
                <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto">
                    <List
                        rowComponent={({ index, style, ariaAttributes }) => (
                            <div style={style} {...ariaAttributes}>
                                <IssuesItem taskData={filteredTasks[index]} />
                            </div>
                        )}
                        rowCount={filteredTasks.length}
                        rowHeight={70}
                        rowProps={{}}
                    />
                </div>

            }

        </div>
    )
}

export default IssuesList
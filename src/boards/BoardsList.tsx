import { type Board } from "../api/boardApi"
import BoardsItem from "./BoardsItem"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from 'react-router-dom'
import { TextField, InputAdornment, IconButton as MIconButton } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
type BoardsListProps = {
    boardsList: Board[]
}

const BoardsList = (props: BoardsListProps) => {

    const { boardsList } = props
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

    type SortKey = 'name' | 'description' | 'taskCount'

    const [sortKey, setSortKey] = useState<SortKey>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const sortedBoards = useMemo(() => {
        const copy = [...boardsList]
        copy.sort((a, b) => {
            let aVal: string | number = ''
            let bVal: string | number = ''

            switch (sortKey) {
                case 'name':
                    aVal = a.name
                    bVal = b.name
                    break
                case 'taskCount':
                    aVal = a.taskCount ?? 0
                    bVal = b.taskCount ?? 0
                    break
                case 'description':
                    aVal = a.description
                    bVal = b.description
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
    }, [boardsList, sortKey, sortOrder])

    const filteredBoards = useMemo(() => {
        if (!query) return sortedBoards
        return sortedBoards.filter(b => b.name.toLowerCase().includes(query))
    }, [sortedBoards, query])

    return (
        <div className="flex flex-col gap-y-3 px-10">
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
            <div className="w-full py-4 px-6 rounded-lg bg-gray-100 border border-gray-200 dark:bg-[#444444] dark:border-[#2c2c2c]
                            grid grid-cols-[2fr_2fr_1fr] gap-4 items-center shadow-sm"
            >
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Доска
                    <button onClick={() => toggleSort('name')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Описание
                    <button onClick={() => toggleSort('description')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group relative">
                    Количество задач
                    <button onClick={() => toggleSort('taskCount')} className="absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700">
                        <SwapVertIcon />
                    </button>
                </p>
            </div>
            {filteredBoards.length == 0 ?
                <p className="text-center text-2xl font-semibold py-5 text-sky-600 dark:text-orange-400">Ничего не найдено</p>
                :
                filteredBoards.map((board) => (
                    <BoardsItem
                        key={board.id}
                        boardData={board}
                    />
                ))
            }

        </div>
    )
}

export default BoardsList
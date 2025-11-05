import BoardTable from "./BoardTable"
import { useParams } from "react-router-dom"
import { useBoard, useBoards } from "../hooks/useBoards"
import LoadingSpinner from "../components/LoadingSpinner"
import { useAppSelector } from '../hooks/redux'
import { useEffect } from "react"
import { useAppDispatch } from '../hooks/redux'
import { setRefetchFalse } from '../store/drawerSlice'

const Board = () => {

    const { id } = useParams()
    const { data: boardTasks, isLoading, isError, error, refetch } = useBoard(Number(id))
    const { data: boards } = useBoards()
    const { refetchState } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const title = boards?.data.find(b => String(b.id) == id)?.name || 'Название'
    const description = boards?.data.find(b => String(b.id) == id)?.description || 'Описание'


    useEffect(() => {
        if (refetchState) {
            refetch()
            dispatch(setRefetchFalse())
        }
    }, [refetchState])


    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    // TODO: virtualizing board table & drag inside the table
    return (
        <div className="py-5 px-5 mt-5 flex flex-1 h-full flex-col overflow-hidden">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <div className="flex flex-1 h-full flex-col overflow-hidden ">
                {boardTasks && <BoardTable
                    boardTasks={boardTasks.data}
                    onRefresh={refetch}
                />}
            </div>
        </div>
    )
}

export default Board
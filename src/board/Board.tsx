import BoardTable from "./BoardTable"
import { useParams } from "react-router-dom"
import { useBoard } from "../hooks/useBoards"
import LoadingSpinner from "../components/LoadingSpinner"
import { useAppSelector } from '../hooks/redux'
import { useEffect } from "react"
import { useAppDispatch } from '../hooks/redux'
import { setRefetchFalse } from '../store/drawerSlice'

const Board = () => {

    const { id } = useParams()
    const { data: boardTasks, isLoading, isError, error, refetch } = useBoard(Number(id))
    const { refetchState } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if( refetchState ) {
            refetch()
            dispatch(setRefetchFalse())
        }
    }, [refetchState])


    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <div className="">
            {boardTasks && <BoardTable 
                boardTasks={boardTasks.data}
                onRefresh={refetch}
            />}
        </div>
    )
}

export default Board
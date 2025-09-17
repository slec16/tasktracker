import BoardTable from "./BoardTable"
import { useParams } from "react-router-dom"
import { useBoard } from "../hooks/useBoards"
import LoadingSpinner from "../components/LoadingSpinner"


const Board = ({openTaskDrawer}: {openTaskDrawer: () => void}) => {

    const { id } = useParams()
    const { data: boardTasks, isLoading, isError, error, refetch } = useBoard(Number(id))


    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <div className="">
            {boardTasks && <BoardTable 
                boardTasks={boardTasks.data}
                onRefresh={refetch}
                openTaskDrawer={openTaskDrawer}
            />}
        </div>
    )
}

export default Board
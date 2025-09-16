// import BoardTable from "./BoardTable"
import { useParams } from "react-router-dom"
import { useBoard } from "../hooks/useBoards"
import LoadingSpinner from "../components/LoadingSpinner"


const Board = () => {

    const { id } = useParams()
    const { data: boardTasks, isLoading, isError, error } = useBoard(Number(id))


    console.log(boardTasks?.data)

    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <>
            {/* <BoardTable /> */}
            <p>board</p>
        </>
    )
}

export default Board
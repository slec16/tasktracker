import { useBoards } from "../hooks/useBoards"
import BoardsList from "./BoardsList"
import LoadingSpinner from "../components/LoadingSpinner"

const Boards = () => {

    const { data: boards, isLoading, isError, error } = useBoards()

    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <div className="py-5 ">
            {boards && <BoardsList 
                boardsList={boards.data}
            />}
        </div>
    )
}

export default Boards
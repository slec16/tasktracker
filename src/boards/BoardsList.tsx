import { type Board } from "../api/boardApi"
import BoardsItem from "./BoardsItem"

type BoardsListProps = {
    boardsList: Board[]
}

const BoardsList = (props: BoardsListProps) => {

    const { boardsList } = props

    return(
        <div className="flex flex-col gap-y-3 pl-10">

            {boardsList.map((board) => (
                <BoardsItem
                    key={board.id}
                    boardData={board}
                />
            ))}

        </div>
    )
}

export default BoardsList
import { type Board } from "../api/boardApi"
import BoardsItem from "./BoardsItem"

type BoardsListProps = {
    boardsList: Board[]
}

const BoardsList = (props: BoardsListProps) => {

    const { boardsList } = props
    
    return (
        <div className="flex flex-col gap-y-3 px-10">
            <div className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 
                dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 
                grid grid-cols-[2fr_2fr_1fr] gap-4 items-center shadow-sm">
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Доска
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Описание
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Количество задач
                </p>
            </div>
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
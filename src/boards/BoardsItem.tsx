import { type Board } from "../api/boardApi"
import { Link } from "react-router-dom"

type BoardsItemProps = {
    boardData: Board
}

const BoardsItem = (props: BoardsItemProps) => {

    const { id, name, description, taskCount } = props.boardData

    return (
        <Link to={`/board/${id}`}>
            <div className="w-full grid grid-cols-[2fr_2fr_1fr] gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm 
                            hover:shadow-lg hover:border-blue-200 hover:bg-blue-50
                            dark:bg-[#333333] dark:border-[#2c2c2c] dark:hover:border-gray-600/50 dark:hover:bg-gray-700/10"
            >
                {/* Заголовок */}
                <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900 leading-tight dark:text-white
                               group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {name}
                    </h3>
                </div>


                {/* Доска */}
                <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-500 font-medium dark:text-gray-400
                             group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {description}
                    </p>

                </div>

                {/* Ответственный */}
                <div className="flex flex-row w-full justify-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 dark:bg-orange-600">
                        <span className="text-xs font-medium text-white">
                            {taskCount}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BoardsItem
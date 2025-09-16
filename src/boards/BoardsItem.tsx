import { type Board } from "../api/boardApi"

type BoardsItemProps = {
    boardData: Board
}

const BoardsItem = (props: BoardsItemProps) => {

    const { id, name, description, taskCount } = props.boardData

    return (
        <div>
            <div className="w-4/5 grid grid-cols-[2fr_2fr_1fr] gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300
                        hover:shadow-lg hover:scale-[1.02] hover:border-blue-200 hover:bg-blue-50
                        dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-orange-900/20 dark:hover:scale-[1.02] dark:hover:border-orange-600/50 dark:hover:bg-orange-700/10">
                {/* Заголовок */}
                <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900 leading-tight dark:text-white
                               group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {name}
                    </h3>
                </div>


                {/* Доска */}
                <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-500 font-medium mb-1 dark:text-gray-400
                             group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {description}
                    </p>

                </div>

                {/* Ответственный */}
                <div className="flex flex-row items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Всего задач</p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6  rounded-full flex items-center justify-center bg-blue-500 dark:bg-orange-600">
                            <span className="text-xs font-medium text-white">
                                {taskCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardsItem
import { type Task } from "../api/taskApi"
import DragHandleIcon from '@mui/icons-material/DragHandle'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { useAppDispatch } from '../hooks/redux'
import { openDrawer } from '../store/drawerSlice'

type IssuesItemProps = {
    taskData: Task
}

const StatusTimeline = ({ status }: { status: string }) => {
    const getStatusIndex = (status: string): number => {
        switch (status) {
            case 'Backlog': return 0
            case 'InProgress': return 1
            case 'Done': return 2
            default: return 0
        }
    }

    const currentIndex = getStatusIndex(status)

    return (
        <div className="flex items-center justify-center space-x-1">
            {/* Точка 1: Backlog */}
            <div className={`w-3 h-3 rounded-full border-2 
                ${currentIndex !== 0
                    ? `${currentIndex == 1
                        ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                        : 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'}`
                    : 'bg-gray-400 border-gray-400 dark:bg-gray-400 dark:border-gray-400'}`}
            />

            {/* Линия между точками 1 и 2 */}
            <div className={`w-8 h-0.5 
                ${currentIndex !== 0
                    ? `${currentIndex == 1
                        ? 'bg-blue-500 dark:bg-blue-600'
                        : 'bg-green-500 dark:bg-green-600'}`
                    : 'bg-gray-400 dark:bg-gray-400'}`}
            />

            {/* Точка 2: In Progress */}
            <div className="relative inline-flex">
                {/* Основная точка */}
                <div className={`w-3 h-3 rounded-full border-2  
                     ${currentIndex !== 0
                        ? `${currentIndex == 1
                            ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                            : 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'}`
                        : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
                />

                {/* Анимированная точка (только для статуса In Progress) */}
                {currentIndex == 1 && (
                    <div className="w-3 h-3 rounded-full border-2 bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600 animate-ping absolute inset-0" />
                )}
            </div>

            {/* Линия между точками 2 и 3 */}
            <div className={`w-8 h-0.5 
                ${currentIndex >= 2
                    ? 'bg-green-500 dark:bg-green-600'
                    : 'bg-gray-300 dark:bg-gray-600'}`}
            />

            {/* Точка 3: Done */}
            <div className={`w-3 h-3 rounded-full border-2 
                ${currentIndex == 2
                    ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                    : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
            />
        </div>
    )
}

const IssuesItem = (props: IssuesItemProps) => {
    const { taskData} = props
    const { title, priority, status, boardName, assignee, id, boardId } = taskData

    const dispatch = useAppDispatch()

    const handleOpenDrawer = () => {
        dispatch(openDrawer({
            drawerId: `${id}`,
            boardId: `${boardId}`
        }));
    }

    const priorityStyles = (priority: string) => {
        switch (priority) {
            case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/40 dark:text-yellow-200 dark:border-yellow-600'
            case 'High': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-700/40 dark:text-red-200 dark:border-red-600'
            default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
        }
    }

    const priorityIcon = (priority: string) => {
        switch (priority) {
            case 'Low': return <KeyboardDoubleArrowDownIcon />
            case 'Medium': return <DragHandleIcon />
            case 'High': return <KeyboardDoubleArrowUpIcon />
            default: return <DragHandleIcon />
        }
    }

    return (
        <div
            onClick={handleOpenDrawer}
            className="w-full grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-4 items-center py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm 
                        hover:shadow-lg hover:border-blue-200 hover:bg-blue-50
                        dark:bg-gray-900 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-orange-900/20 dark:hover:border-orange-600/50 dark:hover:bg-orange-700/10"
        >
            {/* Заголовок */}
            <div className="text-left">
                <h3 className="text-base font-bold text-gray-900 leading-tight dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {title}
                </h3>
            </div>

            {/* Приоритет */}
            <div className="flex justify-center">
                <span className={`px-1 py-1 rounded-full text-xs font-medium border transition-all duration-300 group-hover:scale-105 ${priorityStyles(priority)}`}>
                    {priorityIcon(priority)}
                </span>
            </div>

            {/* Статус */}
            <div className="flex flex-col items-center">
                <p className="text-xs text-gray-600 font-medium my-2 dark:text-gray-400
                             group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {status}
                </p>
                <StatusTimeline status={status} />
            </div>

            {/* Доска */}
            <div className="flex flex-col items-center">
                {/* <p className="text-xs text-gray-500 font-medium mb-1 dark:text-gray-400
                             group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                    Доска
                </p> */}
                <p className="text-sm font-medium text-gray-900 dark:text-gray-300 text-center
                             group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {boardName}
                </p>
            </div>

            {/* Ответственный */}
            <div className="flex flex-col items-center">
                {/* <p className="text-xs text-gray-500 font-medium mb-1 dark:text-gray-400">Ответственный</p> */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center dark:bg-orange-600">
                        <span className="text-xs font-medium text-white">
                            {assignee.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{assignee.fullName}</p>
                </div>
            </div>
        </div>
    )
}

export default IssuesItem
import { type Task } from "../api/taskApi"
import IssuesItem from "./IssuesItem"

type IssuesListProps = {
    taskList: Task[]
    openTaskDrawer: () => void
    getDrawerData: (data) => void
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList, openTaskDrawer, getDrawerData } = props

    return (
        <div className="flex flex-col gap-y-3 px-10">
            {/* table header */}
            <div className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 
                dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 
                grid grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr] gap-4 items-center shadow-sm">
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Задача
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Приоритет
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Статус
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Доска
                </p>
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Ответственный
                </p>
            </div>
            {taskList.map((task) => (
                <IssuesItem
                    key={task.id}
                    taskData={task}
                    openTaskDrawer={openTaskDrawer}
                    getDrawerData={getDrawerData}
                />
            ))}

        </div>
    )
}

export default IssuesList
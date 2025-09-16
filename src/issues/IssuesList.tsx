import { type Task } from "../api/taskApi"
import IssuesItem from "./IssuesItem"

type IssuesListProps = {
    taskList: Task[]
    openTaskDrawer: () => void
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList, openTaskDrawer } = props

    return (
        <div className="flex flex-col gap-y-3 pl-10">

            {taskList.map((task) => (
                <IssuesItem
                    key={task.id}
                    taskData={task}
                    openTaskDrawer={openTaskDrawer}
                />
            ))}

        </div>
    )
}

export default IssuesList
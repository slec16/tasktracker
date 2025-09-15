import { type Task } from "../api/taskApi"
import IssuesItem from "./IssuesItem"

type IssuesListProps = {
    taskList: Task[]
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList } = props
    console.log(taskList)

    return (
        <div className="flex flex-col gap-y-3 pl-10">

            {taskList.map((task) => (
                <IssuesItem
                    key={task.id}
                    taskData={task}
                />
            ))}

        </div>
    )
}

export default IssuesList
import { type Task } from "../api/taskApi"

type IssuesItemProps = {
    taskData: Task
}

const IssuesItem = (props: IssuesItemProps) => {

    const { taskData } = props

    return(
        <div>
            Item
        </div>
    )
}

export default IssuesItem
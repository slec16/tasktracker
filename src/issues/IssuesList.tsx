import { type Task } from "../api/taskApi"

type IssuesListProps = {
    taskList: Task[]
}


const IssuesList = (props: IssuesListProps) => {

    const { taskList } = props

    return(
        <div>
            list
        </div>
    )
}

export default IssuesList
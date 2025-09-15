import { useTasks } from "../hooks/useTasks"
import IssuesList from "./IssuesList"
import LoadingSpinner from "../components/LoadingSpinner"

const Issues = () => {

    const { data: tasks, isLoading, isError, error } = useTasks()

    console.log(tasks?.data)


    if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <div className="py-5 ">
            {tasks && <IssuesList
                taskList={tasks.data}
            />}
        </div>
    )
}

export default Issues
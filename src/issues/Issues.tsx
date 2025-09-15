import { useState, useEffect } from "react"
import { useTasks } from "../hooks/useTasks"
import IssuesList from "./IssuesList"
import LoadingSpinner from "../components/LoadingSpinner"

const Issues = () => {

    const { data: tasks, isLoading, isError, error } = useTasks()

    console.log(tasks)


    if (isLoading) return <LoadingSpinner />
    if (isError) return <div>Ошибка: {error.message}</div>
    return (
        <div className="border py-5">
            {/* <IssuesList

            /> */}
        </div>
    )
}

export default Issues
export interface Task {
    id: number,
    title: string,
    description: string,
    priority: string,
    status: string,
    boardId: number,
    assignee: {
        id: number,
        fullName: string,
        email: string,
        avatarUrl: string
    }
    boardName: string
}

export interface EmptyTask {
    id: number | undefined,
    title: string,
    description: string,
    priority: string,
    status: string,
    // boardId: number,
    assignee: {
        id: number | undefined,
        fullName: string,
        email: string,
        avatarUrl: string
    }
    boardName: string
}

export interface createTask {
    assigneeId: number,
    boardId: number,
    description: string,
    priority: string,
    title: string
}

export interface updateTask {
    assigneeId: number,
    boardId?: number,
    description: string,
    priority: string,
    title: string
    status: string
}

const baseUrl = 'http://localhost:8080'

export const taskApi = {

    getTasks: async (): Promise<{data: Task[]}> => {
        const response = await fetch(`${baseUrl}/api/v1/tasks`)
        if (!response.ok) throw new Error('Failed to fetch tasks')
        return response.json();
    },

    getTask: async (id: number): Promise<{data: Task}> => {
        const response = await fetch(`${baseUrl}/api/v1/tasks/${id}`)
        if (!response.ok) throw new Error('Failed to fetch task')
        return response.json()
    },

    createTask: async (taskData: createTask): Promise<{data: { id: number }}> => {
        const response = await fetch(`${baseUrl}/api/v1/tasks/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task')
        return response.json()
    },

    updateTask: async (id: number, taskData: updateTask): Promise<{message: string}> => {
        const response = await fetch(`${baseUrl}/api/v1/tasks/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    updateTaskStatus: async (id: number, taskStatus: {status: string}): Promise<{data: {message: string}}> => {
        const response = await fetch(`${baseUrl}/api/v1/tasks/updateStatus/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskStatus),
        });
        if (!response.ok) throw new Error('Failed to update task');
        // console.log(await response.json())
        return response.json();
    },


}
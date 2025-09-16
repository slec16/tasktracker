export interface Board {
    id: number,
    name: string,
    description: string,
    taskCount: number
}

export interface BoardTasks {
    assignee: {
      avatarUrl: string,
      email: string,
      fullName: string,
      id: number
    },
    description: string,
    id: number,
    priority: string,
    status: string,
    title: string
}


const baseUrl = 'http://localhost:8080'

export const boardApi = {
    getBoards: async (): Promise<{data: Board[]}> => {
        const response = await fetch(`${baseUrl}/api/v1/boards`)
        if (!response.ok) throw new Error('Failed to fetch boards')
        return response.json()
    },

    //Возвращает все задачи, принадлежащие указанной доске
    getBoard: async (id: number): Promise<BoardTasks[]> => {
        const response = await fetch(`${baseUrl}/api/v1/boards/${id}`)
        if (!response.ok) throw new Error('Failed to fetch board task')
        return response.json()
    }

}

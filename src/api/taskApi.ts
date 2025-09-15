export interface Task {
    id: number,
    title: string,
    description: string,
    priority: string,
    status: string,
    board: string,
    boardName: string
}

export const taskApi = {
    
    getTasks: async (): Promise<Task>  => {

        
    }

}
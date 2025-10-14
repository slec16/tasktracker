export interface User {
    id: number,
    fullName: string,
    email: string,
    description: string,
    avatarUrl: string,
}

const baseUrl = 'http://localhost:8080'


export const usersApi = {
    getUsers: async (): Promise<{data: User[]}> => {
        const response = await fetch(`${baseUrl}/api/v1/users`)
        if (!response.ok) throw new Error('Failed to fetch boards')
        return response.json()
    }
}
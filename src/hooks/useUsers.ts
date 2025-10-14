import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'

// Ключи для query cache
export const usersKeys = {
    all: ['users'] as const,
    lists: () => [...usersKeys.all, 'list'] as const,
    list: (filters: string) => [...usersKeys.lists(), { filters }] as const,
    details: () => [...usersKeys.all, 'detail'] as const,
    detail: (id: number) => [...usersKeys.details(), id] as const,
}


// Хук для получения всех пользователей
export const useUsers = () => {
    return useQuery({
        queryKey: usersKeys.list(''),
        queryFn: usersApi.getUsers,
        staleTime: 1 * 60 * 1000
    })
}


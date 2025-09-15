import { useQuery } from '@tanstack/react-query'
import { boardApi } from '../api/boardApi'

// Ключи для query cache
export const taskKeys = {
    all: ['boards'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
}


// Хук для получения всех досок
export const useBoards = (filters?: string) => {
    return useQuery({
        queryKey: taskKeys.list(filters || ''),
        queryFn: boardApi.getBoards,
        staleTime: 1 * 60 * 1000, // 1 минута
    })
}

// Хук для получения всех задач по доске
export const useBoard = (id: number) => {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => boardApi.getBoard(id),
        enabled: !!id, // Запрос выполнится только если id существует
    })
}
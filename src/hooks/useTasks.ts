import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi, type createTask, type updateTask } from '../api/taskApi'



// Ключи для query cache
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: number) => [...taskKeys.details(), id] as const,
}



// Хук для получения всех задач
export const useTasks = (filters?: string) => {
    return useQuery({
        queryKey: taskKeys.list(filters || ''),
        queryFn: taskApi.getTasks,
        staleTime: 1 * 60 * 1000, // 1 минута
    })
}

// Хук для получения информации по задаче
export const useTask = (id: number) => {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => taskApi.getTask(id),
        enabled: !!id, // Запрос выполнится только если id существует
    })
}

// Хук для создания задачи
export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (taskData: createTask) => taskApi.createTask(taskData),
        onSuccess: () => {
            // Инвалидируем кэш задач после создания
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
        },
    })
}

// Хук для обновления задачи
export const useUpdateTask = (id: number) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, taskData }: { id: number; taskData: updateTask }) => taskApi.updateTask(id, taskData),
        onSuccess: (updatedUser) => {
            // Обновляем конкретную задачу в кэше
            queryClient.setQueryData(taskKeys.detail(id), updatedUser);
            // Инвалидируем список задач
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    })
}

// Хук для обновления статуса задачи
export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, taskStatus }: { id: number; taskStatus: {status: string} }) => taskApi.updateTaskStatus(id, taskStatus),
        onSuccess: (updatedUser) => {
            // Обновляем конкретную задачу в кэше
            // queryClient.setQueryData(taskKeys.detail(id), updatedUser);
            // Инвалидируем список задач
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    })
}



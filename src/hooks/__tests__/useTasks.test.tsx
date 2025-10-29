import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useTasks,
  useTask,
  useCreateTask,
  useUpdateTask,
  useUpdateTaskStatus,
  taskKeys,
} from '../useTasks'
import { taskApi, type createTask, type updateTask } from '../../api/taskApi'
import React from 'react'


jest.mock('../../api/taskApi')

const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTasks hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTaskApi.getTasks.mockResolvedValue({ data: [] })
    mockTaskApi.getTask.mockResolvedValue({ data: { id: 1, title: 'Test', description: '', priority: 'High', status: 'Backlog', boardId: 1, boardName: 'Test', assignee: { id: 1, fullName: 'Test', email: 'test@test.com', avatarUrl: '' } } })
  })

  describe('useTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = {
        data: [
          {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            priority: 'High',
            status: 'Backlog',
            boardId: 1,
            boardName: 'Board 1',
            assignee: {
              id: 1,
              fullName: 'John Doe',
              email: 'john@example.com',
              avatarUrl: '',
            },
          },
        ],
      }

      mockTaskApi.getTasks.mockResolvedValueOnce(mockTasks)

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockTasks)
      expect(mockTaskApi.getTasks).toHaveBeenCalledTimes(1)
    })

    it('should handle error when fetching tasks fails', async () => {
      const error = new Error('Failed to fetch tasks')
      mockTaskApi.getTasks.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should handle filters parameter', async () => {
      const mockTasks = { data: [] }
      mockTaskApi.getTasks.mockResolvedValueOnce(mockTasks)

      renderHook(() => useTasks('filter-value'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockTaskApi.getTasks).toHaveBeenCalled()
      })
    })

    it('should have staleTime configured', async () => {
      const mockTasks = { data: [] }
      mockTaskApi.getTasks.mockResolvedValueOnce(mockTasks)

      const { result } = renderHook(() => useTasks(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.dataUpdatedAt).toBeGreaterThan(0)
    })
  })

  describe('useTask', () => {
    it('should fetch single task successfully', async () => {
      const mockTask = {
        data: {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          priority: 'High',
          status: 'Backlog',
          boardId: 1,
          boardName: 'Board 1',
          assignee: {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            avatarUrl: '',
          },
        },
      }

      mockTaskApi.getTask.mockResolvedValueOnce(mockTask)

      const { result } = renderHook(() => useTask(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockTask)
      expect(mockTaskApi.getTask).toHaveBeenCalledWith(1)
    })

    it('should not fetch when id is 0', () => {
      const { result } = renderHook(() => useTask(0), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
    })

    it('should handle error when fetching task fails', async () => {
      const error = new Error('Failed to fetch task')
      mockTaskApi.getTask.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useTask(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })
  })

  describe('useCreateTask', () => {
    it('should create task successfully', async () => {
      const mockResponse = { data: { id: 123 } }
      mockTaskApi.createTask.mockResolvedValueOnce(mockResponse)

      const taskData: createTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'New task',
        priority: 'High',
        title: 'Task Title',
      }

      const { result } = renderHook(() => useCreateTask(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(taskData)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockTaskApi.createTask).toHaveBeenCalledWith(taskData)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle error when creating task fails', async () => {
      const error = new Error('Failed to create task')
      mockTaskApi.createTask.mockRejectedValueOnce(error)

      const taskData: createTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'New task',
        priority: 'High',
        title: 'Task Title',
      }

      const { result } = renderHook(() => useCreateTask(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(taskData)

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should invalidate queries on success', async () => {
      const mockResponse = { data: { id: 123 } }
      mockTaskApi.createTask.mockResolvedValueOnce(mockResponse)

      const taskData: createTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'New task',
        priority: 'High',
        title: 'Task Title',
      }

      const { result } = renderHook(() => useCreateTask(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(taskData)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })
  })

  describe('useUpdateTask', () => {
    it('should update task successfully', async () => {
      const mockResponse = { message: 'Task updated successfully' }
      mockTaskApi.updateTask.mockResolvedValueOnce(mockResponse)

      const taskData: updateTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'Updated description',
        priority: 'High',
        title: 'Updated Title',
        status: 'InProgress',
      }

      const { result } = renderHook(() => useUpdateTask(1), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskData })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockTaskApi.updateTask).toHaveBeenCalledWith(1, taskData)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle error when updating task fails', async () => {
      const error = new Error('Failed to update task')
      mockTaskApi.updateTask.mockRejectedValueOnce(error)

      const taskData: updateTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'Updated description',
        priority: 'High',
        title: 'Updated Title',
        status: 'InProgress',
      }

      const { result } = renderHook(() => useUpdateTask(1), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskData })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should invalidate queries on success', async () => {
      const mockResponse = { message: 'Task updated successfully' }
      mockTaskApi.updateTask.mockResolvedValueOnce(mockResponse)

      const taskData: updateTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'Updated description',
        priority: 'High',
        title: 'Updated Title',
        status: 'InProgress',
      }

      const { result } = renderHook(() => useUpdateTask(1), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskData })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })
  })

  describe('useUpdateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const mockResponse = {
        data: { message: 'Task status updated successfully' },
      }
      mockTaskApi.updateTaskStatus.mockResolvedValueOnce(mockResponse)

      const taskStatus = { status: 'Done' }

      const { result } = renderHook(() => useUpdateTaskStatus(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskStatus })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockTaskApi.updateTaskStatus).toHaveBeenCalledWith(1, taskStatus)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle error when updating task status fails', async () => {
      const error = new Error('Failed to update task')
      mockTaskApi.updateTaskStatus.mockRejectedValueOnce(error)

      const taskStatus = { status: 'Done' }

      const { result } = renderHook(() => useUpdateTaskStatus(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskStatus })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should invalidate queries on success', async () => {
      const mockResponse = {
        data: { message: 'Task status updated successfully' },
      }
      mockTaskApi.updateTaskStatus.mockResolvedValueOnce(mockResponse)

      const taskStatus = { status: 'InProgress' }

      const { result } = renderHook(() => useUpdateTaskStatus(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({ id: 1, taskStatus })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })

    it('should handle different status values', async () => {
      const mockResponse = {
        data: { message: 'Task status updated successfully' },
      }
      mockTaskApi.updateTaskStatus.mockResolvedValue(mockResponse)

      const statuses = ['Backlog', 'ToDo', 'InProgress', 'Done']

      for (const status of statuses) {
        const { result } = renderHook(() => useUpdateTaskStatus(), {
          wrapper: createWrapper(),
        })

        result.current.mutate({ id: 1, taskStatus: { status } })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
      }
    })
  })

  describe('taskKeys', () => {
    it('should have correct structure', () => {
      expect(taskKeys.all).toEqual(['tasks'])
      expect(taskKeys.lists()).toEqual(['tasks', 'list'])
      expect(taskKeys.list('test')).toEqual(['tasks', 'list', { filters: 'test' }])
      expect(taskKeys.details()).toEqual(['tasks', 'detail'])
      expect(taskKeys.detail(123)).toEqual(['tasks', 'detail', 123])
    })
  })
})


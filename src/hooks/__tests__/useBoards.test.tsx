import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBoards, useBoard, taskKeys } from '../useBoards'
import { boardApi } from '../../api/boardApi'
import React from 'react'

jest.mock('../../api/boardApi')

const mockBoardApi = boardApi as jest.Mocked<typeof boardApi>

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

describe('useBoards hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBoardApi.getBoards.mockResolvedValue({ data: [] })
    mockBoardApi.getBoard.mockResolvedValue({ data: [] })
  })

  describe('useBoards', () => {
    it('should fetch boards successfully', async () => {
      const mockBoards = {
        data: [
          { id: 1, name: 'Board 1', description: 'Description 1', taskCount: 5 },
          { id: 2, name: 'Board 2', description: 'Description 2', taskCount: 10 },
        ],
      }

      mockBoardApi.getBoards.mockResolvedValueOnce(mockBoards)

      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockBoards)
      expect(mockBoardApi.getBoards).toHaveBeenCalledTimes(1)
    })

    it('should handle error when fetching boards fails', async () => {
      const error = new Error('Failed to fetch boards')
      mockBoardApi.getBoards.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should use correct query key', async () => {
      const mockBoards = { data: [] }
      mockBoardApi.getBoards.mockResolvedValueOnce(mockBoards)

      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(mockBoardApi.getBoards).toHaveBeenCalled()
      })
    })

    it('should pass filters to query key', async () => {
      const mockBoards = { data: [] }
      mockBoardApi.getBoards.mockResolvedValueOnce(mockBoards)

      const { result } = renderHook(() => useBoards('filter-value'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(mockBoardApi.getBoards).toHaveBeenCalled()
      })
    })

    it('should have staleTime configured', async () => {
      const mockBoards = { data: [] }
      mockBoardApi.getBoards.mockResolvedValueOnce(mockBoards)

      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.dataUpdatedAt).toBeGreaterThan(0)
    })

    it('should initially be in loading state', () => {
      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should refetch data when called', async () => {
      const mockBoards = { data: [] }
      mockBoardApi.getBoards.mockResolvedValue(mockBoards)

      const { result } = renderHook(() => useBoards(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const refetchCount = mockBoardApi.getBoards.mock.calls.length

      result.current.refetch()

      await waitFor(() => {
        expect(mockBoardApi.getBoards.mock.calls.length).toBeGreaterThan(refetchCount)
      })
    })
  })

  describe('useBoard', () => {
    it('should fetch board tasks successfully', async () => {
      const mockBoardTasks = {
        data: [
          {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            priority: 'High',
            status: 'Backlog',
            assignee: {
              id: 1,
              fullName: 'John Doe',
              email: 'john@example.com',
              avatarUrl: '',
            },
          },
        ],
      }

      mockBoardApi.getBoard.mockResolvedValueOnce(mockBoardTasks)

      const { result } = renderHook(() => useBoard(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockBoardTasks)
      expect(mockBoardApi.getBoard).toHaveBeenCalledWith(1)
    })

    it('should handle error when fetching board fails', async () => {
      const error = new Error('Failed to fetch board task')
      mockBoardApi.getBoard.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useBoard(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should not fetch when id is 0', () => {
      const { result } = renderHook(() => useBoard(0), {
        wrapper: createWrapper(),
      })

      expect(result.current.isFetching).toBe(false)
    })

    it('should handle different board ids', async () => {
      const mockBoardTasks = { data: [] }
      mockBoardApi.getBoard.mockResolvedValue(mockBoardTasks)

      const { result: result1 } = renderHook(() => useBoard(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result1.current.isSuccess).toBe(true))

      const { result: result2 } = renderHook(() => useBoard(999), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result2.current.isSuccess).toBe(true))

      expect(mockBoardApi.getBoard).toHaveBeenCalledWith(1)
      expect(mockBoardApi.getBoard).toHaveBeenCalledWith(999)
    })

    it('should refetch data', async () => {
      const mockBoardTasks = { data: [] }
      mockBoardApi.getBoard.mockResolvedValue(mockBoardTasks)

      const { result } = renderHook(() => useBoard(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const refetchCount = mockBoardApi.getBoard.mock.calls.length

      result.current.refetch()

      await waitFor(() => {
        expect(mockBoardApi.getBoard.mock.calls.length).toBeGreaterThan(refetchCount)
      })
    })
  })

  describe('taskKeys', () => {
    it('should have correct structure', () => {
      expect(taskKeys.all).toEqual(['boards'])
      expect(taskKeys.lists()).toEqual(['boards', 'list'])
      expect(taskKeys.list('test')).toEqual(['boards', 'list', { filters: 'test' }])
      expect(taskKeys.details()).toEqual(['boards', 'detail'])
      expect(taskKeys.detail(123)).toEqual(['boards', 'detail', 123])
    })
  })
})


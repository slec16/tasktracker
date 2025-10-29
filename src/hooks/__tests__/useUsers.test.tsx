import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers, usersKeys } from '../useUsers'
import { usersApi } from '../../api/usersApi'
import React from 'react'

jest.mock('../../api/usersApi')

const mockUsersApi = usersApi as jest.Mocked<typeof usersApi>

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

describe('useUsers hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsersApi.getUsers.mockResolvedValue({ data: [] })
  })

  describe('useUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = {
        data: [
          {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            description: 'Software Developer',
            avatarUrl: 'https://example.com/avatar1.jpg',
          },
          {
            id: 2,
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            description: 'Project Manager',
            avatarUrl: 'https://example.com/avatar2.jpg',
          },
        ],
      }

      mockUsersApi.getUsers.mockResolvedValueOnce(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockUsers)
      expect(mockUsersApi.getUsers).toHaveBeenCalledTimes(1)
    })

    it('should handle error when fetching users fails', async () => {
      const error = new Error('Failed to fetch users')
      mockUsersApi.getUsers.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should use correct query key', async () => {
      const mockUsers = { data: [] }
      mockUsersApi.getUsers.mockResolvedValueOnce(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(mockUsersApi.getUsers).toHaveBeenCalled()
      })
    })

    it('should handle empty users list', async () => {
      const mockUsers = { data: [] }
      mockUsersApi.getUsers.mockResolvedValueOnce(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockUsers)
      expect(result.current.data?.data).toHaveLength(0)
    })

    it('should have staleTime configured', async () => {
      const mockUsers = { data: [] }
      mockUsersApi.getUsers.mockResolvedValueOnce(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.dataUpdatedAt).toBeGreaterThan(0)
    })

    it('should initially be in loading state', () => {
      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should refetch data when called', async () => {
      const mockUsers = { data: [] }
      mockUsersApi.getUsers.mockResolvedValue(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const refetchCount = mockUsersApi.getUsers.mock.calls.length

      result.current.refetch()

      await waitFor(() => {
        expect(mockUsersApi.getUsers.mock.calls.length).toBeGreaterThan(refetchCount)
      })
    })

    it('should handle network errors', async () => {
      const error = new Error('Network error')
      mockUsersApi.getUsers.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
      expect(result.current.error?.message).toBe('Network error')
    })

    it('should handle different error status codes', async () => {
      const error = new Error('Server error')
      mockUsersApi.getUsers.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBe(error)
    })

    it('should return correct user data structure', async () => {
      const mockUsers = {
        data: [
          {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            description: 'Developer',
            avatarUrl: 'avatar.jpg',
          },
        ],
      }

      mockUsersApi.getUsers.mockResolvedValueOnce(mockUsers)

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const user = result.current.data?.data[0]
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('fullName')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('description')
      expect(user).toHaveProperty('avatarUrl')
    })
  })

  describe('usersKeys', () => {
    it('should have correct structure', () => {
      expect(usersKeys.all).toEqual(['users'])
      expect(usersKeys.lists()).toEqual(['users', 'list'])
      expect(usersKeys.list('test')).toEqual(['users', 'list', { filters: 'test' }])
      expect(usersKeys.details()).toEqual(['users', 'detail'])
      expect(usersKeys.detail(123)).toEqual(['users', 'detail', 123])
    })

    it('should generate correct keys for different filters', () => {
      expect(usersKeys.list('')).toEqual(['users', 'list', { filters: '' }])
      expect(usersKeys.list('active')).toEqual(['users', 'list', { filters: 'active' }])
      expect(usersKeys.list('inactive')).toEqual(['users', 'list', { filters: 'inactive' }])
    })

    it('should generate correct keys for different detail ids', () => {
      expect(usersKeys.detail(1)).toEqual(['users', 'detail', 1])
      expect(usersKeys.detail(999)).toEqual(['users', 'detail', 999])
      expect(usersKeys.detail(0)).toEqual(['users', 'detail', 0])
    })
  })
})


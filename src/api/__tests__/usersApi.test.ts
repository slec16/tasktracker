import { usersApi } from '../usersApi'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('usersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUsers', () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      } as Response)

      const result = await usersApi.getUsers()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users')
      expect(result).toEqual(mockUsers)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(usersApi.getUsers()).rejects.toThrow('Failed to fetch boards')
    })

    it('should throw error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(usersApi.getUsers()).rejects.toThrow('Network error')
    })

    it('should handle empty users list', async () => {
      const mockUsers = { data: [] }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      } as Response)

      const result = await usersApi.getUsers()

      expect(result).toEqual(mockUsers)
      expect(result.data).toHaveLength(0)
    })

    it('should handle different HTTP error status codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(usersApi.getUsers()).rejects.toThrow('Failed to fetch boards')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response)

      await expect(usersApi.getUsers()).rejects.toThrow('Failed to fetch boards')
    })
  })
})

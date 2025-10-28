import { boardApi } from '../boardApi'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('boardApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBoards', () => {
    it('should fetch boards successfully', async () => {
      const mockBoards = {
        data: [
          { id: 1, name: 'Board 1', description: 'Description 1', taskCount: 5 },
          { id: 2, name: 'Board 2', description: 'Description 2', taskCount: 10 },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBoards,
      } as Response)

      const result = await boardApi.getBoards()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/boards')
      expect(result).toEqual(mockBoards)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(boardApi.getBoards()).rejects.toThrow('Failed to fetch boards')
    })

    it('should throw error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(boardApi.getBoards()).rejects.toThrow('Network error')
    })
  })

  describe('getBoard', () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBoardTasks,
      } as Response)

      const result = await boardApi.getBoard(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/boards/1')
      expect(result).toEqual(mockBoardTasks)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(boardApi.getBoard(1)).rejects.toThrow('Failed to fetch board task')
    })

  })
})

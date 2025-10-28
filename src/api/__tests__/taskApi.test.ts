import { taskApi } from '../taskApi'
import type { createTask, updateTask } from '../taskApi'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('taskApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTasks', () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response)

      const result = await taskApi.getTasks()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks')
      expect(result).toEqual(mockTasks)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(taskApi.getTasks()).rejects.toThrow('Failed to fetch tasks')
    })
  })

  describe('getTask', () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      } as Response)

      const result = await taskApi.getTask(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/1')
      expect(result).toEqual(mockTask)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(taskApi.getTask(1)).rejects.toThrow('Failed to fetch task')
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData: createTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'New task description',
        priority: 'Medium',
        title: 'New Task',
      }

      const mockResponse = {
        data: { id: 123 },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await taskApi.createTask(taskData)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when creation fails', async () => {
      const taskData: createTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'New task description',
        priority: 'Medium',
        title: 'New Task',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(taskApi.createTask(taskData)).rejects.toThrow('Failed to create task')
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskData: updateTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'Updated description',
        priority: 'High',
        title: 'Updated Task',
        status: 'InProgress',
      }

      const mockResponse = {
        message: 'Task updated successfully',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await taskApi.updateTask(1, taskData)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/update/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when update fails', async () => {
      const taskData: updateTask = {
        assigneeId: 1,
        boardId: 1,
        description: 'Updated description',
        priority: 'High',
        title: 'Updated Task',
        status: 'InProgress',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(taskApi.updateTask(1, taskData)).rejects.toThrow('Failed to update task')
    })
  })

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const taskStatus = { status: 'Done' }
      const mockResponse = {
        data: { message: 'Task status updated successfully' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await taskApi.updateTaskStatus(1, taskStatus)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/updateStatus/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskStatus),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when status update fails', async () => {
      const taskStatus = { status: 'Done' }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(taskApi.updateTaskStatus(1, taskStatus)).rejects.toThrow('Failed to update task')
    })

    it('should handle different status values', async () => {
      const taskStatus = { status: 'InProgress' }
      const mockResponse = {
        data: { message: 'Task status updated successfully' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await taskApi.updateTaskStatus(999, taskStatus)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/updateStatus/999', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskStatus),
      })
    })
  })
})

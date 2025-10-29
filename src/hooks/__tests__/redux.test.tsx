import { renderHook, act } from '@testing-library/react'
import { useAppDispatch, useAppSelector } from '../redux'
import { store } from '../../store'
import { Provider } from 'react-redux'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
)

describe('redux hooks', () => {
  describe('useAppDispatch', () => {
    it('should return a dispatch function', () => {
      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe('function')
    })

    it('should be able to dispatch actions', () => {
      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      const dispatchFn = result.current
      expect(() => {
        dispatchFn({ type: 'test/action' })
      }).not.toThrow()
    })
  })

  describe('useAppSelector', () => {
    it('should return the correct state type', () => {
      const { result } = renderHook(() => useAppSelector((state) => state.drawer), { wrapper })

      expect(result.current).toBeDefined()
      expect(result.current).toHaveProperty('isOpen')
      expect(result.current).toHaveProperty('drawerId')
      expect(result.current).toHaveProperty('boardId')
    })

    it('should return drawer state', () => {
      const { result } = renderHook(() => useAppSelector((state) => state.drawer), { wrapper })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.drawerId).toBe(null)
      expect(result.current.boardId).toBe(null)
    })

    it('should handle multiple selector calls', () => {
      const { result: result1 } = renderHook(() => useAppSelector((state) => state.drawer.isOpen), { wrapper })
      const { result: result2 } = renderHook(() => useAppSelector((state) => state.drawer.drawerId), { wrapper })
      const { result: result3 } = renderHook(() => useAppSelector((state) => state.drawer.boardId), { wrapper })

      expect(result1.current).toBe(false)
      expect(result2.current).toBe(null)
      expect(result3.current).toBe(null)
    })

    it('should update when state changes', () => {
      const { result, rerender } = renderHook(() => useAppSelector((state) => state.drawer), { wrapper })

      expect(result.current.isOpen).toBe(false)

      const { result: dispatchResult } = renderHook(() => useAppDispatch(), { wrapper })
      
      act(() => {
        dispatchResult.current({
          type: 'drawer/openDrawer',
          payload: { drawerId: '123', boardId: '456' },
        })
      })

      rerender()

      expect(result.current.isOpen).toBe(true)
      expect(result.current.drawerId).toBe('123')
      expect(result.current.boardId).toBe('456')
    })
  })
})


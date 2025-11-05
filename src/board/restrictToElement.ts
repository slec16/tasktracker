import type { Modifier } from '@dnd-kit/core'


const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

export const restrictToElement = (getElement: () => HTMLElement | null): Modifier => {
    return ({ transform, draggingNodeRect, overlayNodeRect }) => {
        
        const container = getElement()
        
        const rect = overlayNodeRect ?? draggingNodeRect

        
        if (!container || !rect) {
            return transform
        }

        const containerRect = container.getBoundingClientRect()

        const minX = containerRect.left - rect.left
        const maxX = containerRect.right - rect.right

        const minY = containerRect.top - rect.top
        const maxY = containerRect.bottom - rect.bottom

        return {
            ...transform,
            x: clamp(transform.x, minX, maxX),
            y: clamp(transform.y, minY, maxY),
        }
    }
}
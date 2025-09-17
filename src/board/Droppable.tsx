import {useDroppable} from '@dnd-kit/core'
import type { ReactNode } from 'react'

export function Droppable(props: {id: string, children: ReactNode}) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  })
  
  const style = {
    backgroundColor: isOver ? 'rgba(76, 175, 80, 0.1)' : undefined,
    border: isOver ? '2px dashed #4CAF50' : '0px dashed #4CAF50',
    borderRadius: '0px 0px 8px 8px',
    padding: isOver ? '8px' : '0px',
    transition: 'all 0.2s ease',
  }
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
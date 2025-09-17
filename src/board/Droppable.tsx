import {useDroppable} from '@dnd-kit/core'
import type { ReactNode } from 'react'

export function Droppable(props: {id: string, children: ReactNode}) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  })
  const style = {
    color: isOver ? 'green' : undefined,
  }
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
import { type BoardTasks } from "../api/boardApi"
import DragHandleIcon from '@mui/icons-material/DragHandle'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { useDraggable, useDndContext } from '@dnd-kit/core'
import type { ReactNode } from "react"

export function Draggable(props: { id: string, status: string, children: ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: {
            index: props.id,
            status: props.status
        },
    })

    const { active } = useDndContext()
    const isActive = active?.id === props.id

    const style = {
        transform: transform 
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        scale: isActive ? '1.05' : '1',
        transition: 'scale 0.2s ease',
        zIndex: isActive ? 10 : 1,
        ...(isActive && {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        })
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </div>
    )
}

type BoardTableCardProps = {
    task: BoardTasks
    openTaskDrawer: () => void
}

const BoardTableCard = (props: BoardTableCardProps) => {

    const { task, openTaskDrawer } = props

    const priorityStyles = (priority: string) => {
        switch (priority) {
            case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/40 dark:text-yellow-200 dark:border-yellow-600'
            case 'High': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-700/40 dark:text-red-200 dark:border-red-600'
            default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
        }
    }

    const priorityIcon = (priority: string) => {
        switch (priority) {
            case 'Low': return <KeyboardDoubleArrowDownIcon fontSize="small" />
            case 'Medium': return <DragHandleIcon fontSize="small" />
            case 'High': return <KeyboardDoubleArrowUpIcon fontSize="small" />
            default: return <DragHandleIcon fontSize="small" />
        }
    }

    return (
        <Draggable id={`${task.id}`} status={`${task.status}`}>
            <div
                onClick={openTaskDrawer}
                key={task.id}
                className="bg-gray-50 dark:bg-gray-700/60 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md"
            >
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                    {task.title}
                </h3>
                <div className="flex items-center justify-between">
                    <div className="flex justify-center">
                        <span className={`px-1 py-1 rounded-full text-xs font-medium border ${priorityStyles(task.priority)}`}>
                            {priorityIcon(task.priority)}
                        </span>
                    </div>
                    <div className="w-6 h-6 bg-blue-500 dark:bg-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                            {task.assignee.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                </div>
            </div>
        </Draggable>
    )
}

export default BoardTableCard
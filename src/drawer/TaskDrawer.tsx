import Drawer from '@mui/material/Drawer'
import { useTask } from '../hooks/useTasks'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { closeDrawer } from '../store/drawerSlice'
import DrawerContent from './DrawerContent'
import DrawerProgress from './DrawerProgress'

const TaskDrawer = () => {

    const { isOpen, drawerId } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const { data: task, isLoading, refetch } = useTask(Number(drawerId))

    console.log(task?.data)

    const handleClose = () => {
        dispatch(closeDrawer())
    }

    const emptyTask = {
        id: undefined,
        title: '',
        description: '',
        priority: '',
        status: '',
        assignee: {
            id: undefined,
            fullName: '',
            email: '',
            avatarUrl: ''
        },
        boardName: ''
    }

    return (
        <Drawer
            open={isOpen}
            onClose={handleClose}
            inert={!isOpen}
            anchor='right'
            sx={{
                '& .MuiDrawer-paper': {
                    width: '33vw', // 33% от ширины viewport
                }
            }}
        >
            {isLoading ?
            <div className='px-2 pt-5'>
                <DrawerProgress />
            </div>
                :    
                <DrawerContent
                    onCloseDrawer={handleClose}
                    drawerData={task ? task.data : emptyTask}
                    onRefresh={refetch}
                />
            }
        </Drawer >
    )
}

export default TaskDrawer
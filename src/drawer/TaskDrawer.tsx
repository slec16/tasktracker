import Drawer from '@mui/material/Drawer'
import { useTask } from '../hooks/useTasks'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { closeDrawer } from '../store/drawerSlice'
import DrawerContent from './DrawerContent'

const TaskDrawer = () => {

    const { isOpen, drawerId } = useAppSelector((state) => state.drawer)
    const dispatch = useAppDispatch()

    const { data: task, isLoading, isError, error, refetch } = useTask(Number(drawerId))

    // console.log(task?.data)

    // useEffect(() => {
    //     console.log(isLoading)
    // }, [isLoading])

    const handleClose = () => {
        dispatch(closeDrawer())
    }

    const emptyTask = {
        id: undefined,
        title: '',
        description: '',
        priority: '',
        status: '',
        boardId: undefined,
        assignee: {
            id: undefined,
            fullName: '',
            email: '',
            avatarUrl: ''
        },
        boardName: ''
    }

    // if (isLoading) return <div className="items-center flex justify-center"><LoadingSpinner /></div>
    // if (isError) return <div>Ошибка: {error.message}</div>
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
            <DrawerContent
                onCloseDrawer={handleClose}
                drawerData={task ? task.data : emptyTask}
                onRefresh={refetch}
            />
        </Drawer >
    )
}

export default TaskDrawer